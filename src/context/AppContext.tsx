import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Asset, Notification } from '../types';
import { CURRENT_USER, MOCK_ASSETS, MOCK_NOTIFICATIONS, INITIAL_USERS } from '../data';

interface AppContextType {
  user: User | null;
  assets: Asset[];
  users: User[];
  notifications: Notification[];
  login: (email: string) => void;
  signup: (username: string, email: string) => void;
  logout: () => void;
  updateProfile: (bio: string, avatarUrl: string) => void;
  togglePremium: () => void;
  claimDailyReward: () => void;
  purchaseAsset: (assetId: string) => boolean;
  addAsset: (asset: Asset) => void;
  updateAssetStatus: (assetId: string, status: 'approved' | 'rejected') => void;
  markNotificationRead: (id: string) => void;
  toggleFavorite: (assetId: string) => void;
  giveTokens: (userId: string, amount: number) => void;
  verifyUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pirate_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const userEmail = localStorage.getItem('pirate_current_user_email');
    if (userEmail) {
      const saved = localStorage.getItem('pirate_users');
      const allUsers = saved ? JSON.parse(saved) : INITIAL_USERS;
      return allUsers.find((u: User) => u.email === userEmail) || null;
    }
    return CURRENT_USER;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('pirate_assets');
    return saved ? JSON.parse(saved) : MOCK_ASSETS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('pirate_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('pirate_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pirate_current_user_email', user.email);
    } else {
      localStorage.removeItem('pirate_current_user_email');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pirate_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('pirate_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = (email: string) => {
    // In a real app we'd fetch this from DB
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        setUser(existing);
    } else {
        alert("Account not found. Please sign up.");
    }
  };

  const signup = (username: string, email: string) => {
    if (email.toLowerCase() === 'stickmans427@gmail.com') {
        alert("This email is reserved for the owner.");
        return;
    }
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        alert("Account with this email already exists.");
        return;
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      email,
      avatarUrl: `https://i.pinimg.com/originals/19/76/9c/19769cc33d2d3a29620cb15caa918feb.jpg?nii=t`,
      tokens: 100, // starting balance
      isPremium: false,
      joinDate: new Date().toISOString(),
      role: 'user',
      isVerified: false,
      bio: 'A new user exploring Pirate.'
    };
    setUsers([...users, newUser]);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const claimDailyReward = () => {
    if (!user) return;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastClaimStr = user.lastDailyReward ? new Date(user.lastDailyReward).toISOString().split('T')[0] : '';
    
    if (todayStr === lastClaimStr) {
       alert('You have already claimed your daily reward today. Come back tomorrow!');
       return;
    }

    const reward = Math.floor(Math.random() * (25 - 5 + 1)) + 5; // 5-25 tokens
    const updatedUser = { ...user, tokens: user.tokens + Math.floor(reward), lastDailyReward: now.toISOString() };
    setUser(updatedUser);
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    alert(`You claimed your daily reward of ${Math.floor(reward)} Tokens!`);
  };

  const updateProfile = (bio: string, avatarUrl: string) => {
     if (!user) return;
     const updatedUser = { ...user, bio, avatarUrl };
     setUser(updatedUser);
     setUsers(users.map(u => u.id === user.id ? updatedUser : u));
  };

  const togglePremium = () => {
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
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      if (!user.isPremium) {
          alert('Premium activated!');
      } else {
          alert('Premium canceled.');
      }
  };

  const purchaseAsset = (assetId: string) => {
    if (!user) return false;
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return false;
    if (user.purchasedAssets?.includes(assetId)) return true;
    if (user.tokens < asset.price) return false;

    const updatedUser = { 
        ...user, 
        tokens: user.tokens - asset.price,
        purchasedAssets: [...(user.purchasedAssets || []), assetId]
    };
    setUser(updatedUser);
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    return true;
  };

  const toggleFavorite = (assetId: string) => {
    if (!user) return;
    const isFavorited = user.favoritedAssets?.includes(assetId);
    const updatedUser = {
      ...user,
      favoritedAssets: isFavorited
        ? user.favoritedAssets?.filter(id => id !== assetId)
        : [...(user.favoritedAssets || []), assetId]
    };
    setUser(updatedUser);
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));

    setAssets(assets.map(a => a.id === assetId ? {
      ...a,
      favoritesCount: isFavorited ? Math.max(0, a.favoritesCount - 1) : a.favoritesCount + 1
    } : a));
  };

  const addAsset = (asset: Asset) => {
    setAssets([asset, ...assets]);
  };

  const updateAssetStatus = (assetId: string, status: 'approved' | 'rejected') => {
      setAssets(assets.map(a => a.id === assetId ? { ...a, status } : a));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const giveTokens = (userId: string, amount: number) => {
      setUsers(users.map(u => u.id === userId ? { ...u, tokens: u.tokens + amount } : u));
      if (user?.id === userId) setUser({ ...user, tokens: user.tokens + amount });
  };

  const verifyUser = (userId: string) => {
      setUsers(users.map(u => u.id === userId ? { ...u, isVerified: true } : u));
      if (user?.id === userId) setUser({ ...user, isVerified: true });
  }

  return (
    <AppContext.Provider value={{
      user, assets, users, notifications,
      login, signup, logout, updateProfile, togglePremium, claimDailyReward, purchaseAsset, addAsset,
      updateAssetStatus, markNotificationRead, giveTokens, verifyUser, toggleFavorite
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
