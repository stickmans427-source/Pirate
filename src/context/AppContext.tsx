import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Asset, Notification } from '../types';
import { MOCK_ASSETS, MOCK_NOTIFICATIONS, INITIAL_USERS } from '../data';
import { auth, db, signInWithGoogle as firebaseSignIn } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, query, getDocs } from 'firebase/firestore';

interface AppContextType {
  user: User | null;
  assets: Asset[];
  users: User[];
  notifications: Notification[];
  login: () => Promise<void>;
  signup: () => Promise<void>; // Aliased to login for Google auth
  logout: () => Promise<void>;
  updateProfile: (bio: string, avatarUrl: string) => Promise<void>;
  togglePremium: () => Promise<void>;
  claimDailyReward: () => Promise<void>;
  purchaseAsset: (assetId: string) => Promise<boolean>;
  addAsset: (asset: Asset) => Promise<void>;
  updateAssetStatus: (assetId: string, status: 'approved' | 'rejected') => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  updateAsset: (assetId: string, updates: Partial<Asset>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  toggleFavorite: (assetId: string) => Promise<void>;
  giveTokens: (userId: string, amount: number) => Promise<void>;
  verifyUser: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>(() => {
    // Initial load from localStorage as fallback before Firebase loads
    const saved = localStorage.getItem('pirate_assets_local');
    return saved ? JSON.parse(saved) : MOCK_ASSETS;
  });
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Firestore Auth & User Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        } else {
          // Create new user profile
          const newUser: User = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown User',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || `https://i.pinimg.com/originals/19/76/9c/19769cc33d2d3a29620cb15caa918feb.jpg?nii=t`,
            tokens: 100, // starting balance
            isPremium: false,
            joinDate: new Date().toISOString(),
            role: firebaseUser.email?.toLowerCase() === 'stickmans427@gmail.com' ? 'owner' : 'user',
            isVerified: false,
            bio: 'A new user exploring Pirate.'
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync users collection for admin panel
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
       const fetchedUsers = snapshot.docs.map(doc => doc.data() as User);
       setUsers(fetchedUsers.length > 0 ? fetchedUsers : INITIAL_USERS);
    }, (error) => {
       console.log("Error loading users, perhaps due to permissions:", error);
    });
    return () => unsub();
  }, []);

  // Sync assets globally
  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'assets')), (snapshot) => {
      const fetchedAssets = snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as Asset));
      if (fetchedAssets.length > 0) {
        setAssets(fetchedAssets);
        localStorage.setItem('pirate_assets_local', JSON.stringify(fetchedAssets));
      } else if (assets.length > 0 && assets[0].id === MOCK_ASSETS[0].id) {
        // If DB is empty and we have mock assets, let's keep mock assets in state
        // but avoid overwriting them back to DB right now to save quota
        setAssets(MOCK_ASSETS);
      }
    });
    return () => unsub();
  }, []);

  // We are keeping notifications locally for this prototype because it's complex to migrate fully
  useEffect(() => {
    const saved = localStorage.getItem('pirate_notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('pirate_notifications', JSON.stringify(notifications));
  }, [notifications]);


  const login = async () => {
    try {
      await firebaseSignIn();
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed.");
    }
  };

  const signup = login;

  const logout = async () => {
    await signOut(auth);
  };

  const claimDailyReward = async () => {
    if (!user) return;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastClaimStr = user.lastDailyReward ? new Date(user.lastDailyReward).toISOString().split('T')[0] : '';
    
    if (todayStr === lastClaimStr) {
       alert('You have already claimed your daily reward today. Come back tomorrow!');
       return;
    }

    const reward = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
    const updatedUser = { ...user, tokens: user.tokens + Math.floor(reward), lastDailyReward: now.toISOString() };
    
    setUser(updatedUser);
    await updateDoc(doc(db, 'users', user.id), {
        tokens: updatedUser.tokens,
        lastDailyReward: updatedUser.lastDailyReward
    });
    alert(`You claimed your daily reward of ${Math.floor(reward)} Tokens!`);
  };

  const updateProfile = async (bio: string, avatarUrl: string) => {
     if (!user) return;
     const updatedUser = { ...user, bio, avatarUrl };
     setUser(updatedUser);
     await updateDoc(doc(db, 'users', user.id), { bio, avatarUrl });
  };

  const togglePremium = async () => {
      if (!user) return;
      const confirmMsg = user.isPremium ? 'Are you sure you want to cancel your Premium subscription?' : 'Would you like to activate Premium for 500 tokens?';
      if (!window.confirm(confirmMsg)) return;

      if (!user.isPremium && user.tokens < 500) {
          alert('Not enough tokens to activate Premium.');
          return;
      }

      const updatedUser = { 
          ...user, 
          isPremium: !user.isPremium,
          tokens: user.isPremium ? user.tokens : user.tokens - 500 
      };
      
      setUser(updatedUser);
      await updateDoc(doc(db, 'users', user.id), {
          isPremium: updatedUser.isPremium,
          tokens: updatedUser.tokens
      });
      
      if (!user.isPremium) {
          alert('Premium activated!');
      } else {
          alert('Premium canceled.');
      }
  };

  const purchaseAsset = async (assetId: string) => {
    if (!user) return false;
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return false;
    if (user.purchasedAssets?.includes(assetId)) return true;
    if (user.tokens < asset.price) return false;

    const newPurchased = [...(user.purchasedAssets || []), assetId];
    const updatedUser = { 
        ...user, 
        tokens: user.tokens - asset.price,
        purchasedAssets: newPurchased
    };
    setUser(updatedUser);
    
    await updateDoc(doc(db, 'users', user.id), {
        tokens: updatedUser.tokens,
        purchasedAssets: newPurchased
    });

    // Also increase asset download count
    await updateDoc(doc(db, 'assets', assetId), {
        downloadsCount: asset.downloadsCount + 1
    });

    return true;
  };

  const toggleFavorite = async (assetId: string) => {
    if (!user) return;
    const isFavorited = user.favoritedAssets?.includes(assetId);
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const updatedFavorited = isFavorited
        ? user.favoritedAssets?.filter(id => id !== assetId) || []
        : [...(user.favoritedAssets || []), assetId];

    const updatedUser = { ...user, favoritedAssets: updatedFavorited };
    setUser(updatedUser);
    
    await updateDoc(doc(db, 'users', user.id), {
        favoritedAssets: updatedFavorited
    });

    await updateDoc(doc(db, 'assets', assetId), {
        favoritesCount: isFavorited ? Math.max(0, asset.favoritesCount - 1) : asset.favoritesCount + 1
    });
  };

  const addAsset = async (asset: Asset) => {
    // Generate a clean doc id or let firebase auto-generate? We'll provide it
    const newId = `a${Date.now()}`;
    const newAsset = { ...asset, id: newId };
    try {
        await setDoc(doc(db, 'assets', newId), newAsset);
    } catch (e) {
        console.error("Failed to add asset:", e);
        if (e instanceof Error && e.message.includes('QuotaExceeded')) {
            alert("Database quota exceeded. File content might be too large.");
        }
    }
  };

  const updateAssetStatus = async (assetId: string, status: 'approved' | 'rejected') => {
      await updateDoc(doc(db, 'assets', assetId), { status });
  };

  const deleteAsset = async (assetId: string) => {
      await deleteDoc(doc(db, 'assets', assetId));
  };

  const updateAsset = async (assetId: string, updates: Partial<Asset>) => {
      await updateDoc(doc(db, 'assets', assetId), { ...updates, lastUpdatedDate: new Date().toISOString() });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const giveTokens = async (userId: string, amount: number) => {
      const targetUser = users.find(u => u.id === userId);
      if (targetUser) {
          await updateDoc(doc(db, 'users', userId), { tokens: targetUser.tokens + amount });
      }
  };

  const verifyUser = async (userId: string) => {
      await updateDoc(doc(db, 'users', userId), { isVerified: true });
  }

  return (
    <AppContext.Provider value={{
      user, assets, users, notifications,
      login, signup, logout, updateProfile, togglePremium, claimDailyReward, purchaseAsset, addAsset,
      updateAssetStatus, deleteAsset, updateAsset, markNotificationRead, giveTokens, verifyUser, toggleFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

