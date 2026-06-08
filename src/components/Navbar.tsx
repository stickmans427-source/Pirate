import { Link, useLocation } from 'react-router-dom';
import { Bell, Coins, Search, User as UserIcon, Wallet, Upload, Gift, Menu, X, LogOut, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import { formatTokens } from '../utils';

export function Navbar() {
  const { user, claimDailyReward, notifications, login, signup, logout } = useAppContext();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [ownerAttempts, setOwnerAttempts] = useState(0);
  const [ownerLockedUntil, setOwnerLockedUntil] = useState<number | null>(null);

  const handleAuth = () => {
    const targetEmail = email.toLowerCase().trim();
    if (authMode === 'login') {
      if (targetEmail === 'stickmans427@gmail.com') {
          if (ownerLockedUntil && Date.now() < ownerLockedUntil) {
              alert(`Account locked. Try again later.`);
              return;
          }

          if (password === 'bcd32zylo22') {
              login(targetEmail);
              setShowAuthModal(false);
              setOwnerAttempts(0);
          } else {
             const newAttempts = ownerAttempts + 1;
             setOwnerAttempts(newAttempts);
             if (newAttempts >= 3) {
                 setOwnerLockedUntil(Date.now() + 5 * 60 * 60 * 1000); // 5 hours
                 alert('Too many failed attempts. Locked for 5 hours.');
             } else {
                 alert(`Incorrect password. ${3 - newAttempts} attempts left.`);
             }
          }
      } else {
         login(targetEmail);
         setShowAuthModal(false);
      }
    } else {
      signup(username, targetEmail);
      setShowAuthModal(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
    <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
                P
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Pirate</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-600'}`}>
                Marketplace
              </Link>
              <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/dashboard' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-600'}`}>
                Seller Dashboard
              </Link>
              {user?.role === 'owner' && (
                <Link to="/admin" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/admin' ? 'border-red-500 text-white' : 'border-transparent text-neutral-400 hover:text-red-400 hover:border-red-600'}`}>
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <div className="w-full max-w-lg relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-neutral-700 rounded-lg leading-5 bg-neutral-800 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search assets, scripts, models..."
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <button 
                  onClick={claimDailyReward}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors tooltip"
                  title="Claim Daily Reward"
                >
                  <Gift className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">{formatTokens(user.tokens)}</span>
                </div>

                {user.isPremium && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                    <span className="text-xs font-bold uppercase tracking-wider">Premium</span>
                  </div>
                )}
                {user.role === 'owner' && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Owner</span>
                  </div>
                )}
                
                <Link to="/upload" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                  <Upload className="h-4 w-4 mr-1.5" />
                  Publish
                </Link>

                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white focus:outline-none relative"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-neutral-900" />
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50 border border-neutral-700">
                      <div className="px-4 py-2 border-b border-neutral-700 flex justify-between items-center">
                        <span className="text-sm font-medium text-white">Notifications</span>
                        <span className="text-xs text-indigo-400 cursor-pointer">Mark all read</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(n => (
                          <div key={n.id} className={`px-4 py-3 hover:bg-neutral-700 ${!n.read ? 'bg-neutral-800/50' : ''}`}>
                            <p className="text-sm text-neutral-300">{n.message}</p>
                            <p className="text-xs text-neutral-500 mt-1">{new Date(n.date).toLocaleString()}</p>
                          </div>
                        )) : (
                          <div className="px-4 py-3 text-sm text-neutral-500">No new notifications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group cursor-pointer">
                  <div className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-neutral-700 transition relative">
                    <img className="h-8 w-8 rounded-full bg-neutral-800" src={user.avatarUrl} alt="" />
                     {user.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full border-2 border-neutral-900 w-4 h-4 flex items-center justify-center">
                            <span className="text-[10px] text-white">â</span>
                        </div>
                     )}
                  </div>
                  <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                     <div className="bg-neutral-800 border border-neutral-700 rounded-md shadow-lg p-2 space-y-1">
                        <Link to="/profile" className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded flex items-center gap-2">
                           <UserIcon className="w-4 h-4" /> Profile
                        </Link>
                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 rounded flex items-center gap-2">
                           <LogOut className="w-4 h-4" /> Log Out
                        </button>
                     </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="text-neutral-300 hover:text-white text-sm font-medium"
                >
                  Log In
                </button>
                <button 
                  onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-400 hover:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
             <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-neutral-800">
                Marketplace
             </Link>
             <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-700">
                Seller Dashboard
             </Link>
             <Link to="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-neutral-700">
                Upload Asset
             </Link>
          </div>
        </div>
      )}
    </nav>

    {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
                <button 
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>

                <div className="space-y-4">
                    {authMode === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Username</label>
                            <input 
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="RobloxDev99"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="user@example.com"
                        />
                    </div>
                    {email.toLowerCase().trim() === 'stickmans427@gmail.com' && authMode === 'login' && (
                        <div>
                            <label className="block text-sm font-medium text-amber-400 mb-1 flex items-center gap-1">
                                <Shield className="w-4 h-4"/> Owner Verification
                            </label>
                            <input 
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-neutral-800 border border-amber-500/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                                placeholder="Enter owner passcode"
                            />
                        </div>
                    )}

                    <button 
                        onClick={handleAuth}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
                    >
                        {authMode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-neutral-500">
                    {authMode === 'login' ? (
                        <p>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-indigo-400 hover:underline">Sign up</button></p>
                    ) : (
                        <p>Already have an account? <button onClick={() => setAuthMode('login')} className="text-indigo-400 hover:underline">Log in</button></p>
                    )}
                </div>
            </div>
        </div>
    )}
    </>
  );
}
