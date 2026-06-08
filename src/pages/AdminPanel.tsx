import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Check, X, Shield, Coins, UserCheck } from 'lucide-react';
import { Asset, User } from '../types';

export function AdminPanel() {
  const { user, assets, users, updateAssetStatus, giveTokens, verifyUser } = useAppContext();
  const [targetEmail, setTargetEmail] = useState('');
  const [tokenAmount, setTokenAmount] = useState<number | ''>('');

  if (user?.role !== 'owner') {
    return <div className="text-center py-20 text-white">Access Denied. Owner level required.</div>;
  }

  const pendingAssets = assets.filter(a => a.status === 'pending');

  const handleGiveTokens = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = users.find(u => u.email === targetEmail);
    if (!targetUser) {
        alert('User not found.');
        return;
    }
    if (typeof tokenAmount !== 'number' || tokenAmount <= 0) {
        alert('Invalid amount.');
        return;
    }
    giveTokens(targetUser.id, tokenAmount);
    alert(`Successfully gave ${tokenAmount} tokens to ${targetUser.username}`);
    setTargetEmail('');
    setTokenAmount('');
  };

  const handleVerify = (targetUser: User) => {
      verifyUser(targetUser.id);
      alert(`Verified ${targetUser.username}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
       <div className="flex items-center gap-3 mb-8">
           <Shield className="w-8 h-8 text-red-500" />
           <h1 className="text-3xl font-bold text-white">Owner Admin Panel</h1>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Asset Moderation */}
           <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   Asset Moderation Queue ({pendingAssets.length})
               </h2>

               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                   {pendingAssets.map(asset => (
                       <div key={asset.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                           <img src={asset.previewImages[0]} className="w-24 h-24 object-cover rounded bg-black" />
                           <div className="flex-1">
                               <h3 className="font-bold text-white">{asset.name}</h3>
                               <p className="text-sm text-neutral-400">By {asset.creatorName}</p>
                               <div className="mt-2 text-xs text-neutral-500 line-clamp-2">{asset.description}</div>
                               <div className="mt-3 flex gap-2">
                                   <button 
                                      onClick={() => updateAssetStatus(asset.id, 'approved')}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded text-sm font-medium transition-colors"
                                   >
                                       <Check className="w-4 h-4" /> Approve
                                   </button>
                                   <button 
                                      onClick={() => updateAssetStatus(asset.id, 'rejected')}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-sm font-medium transition-colors"
                                   >
                                       <X className="w-4 h-4" /> Reject
                                   </button>
                               </div>
                           </div>
                       </div>
                   ))}
                   {pendingAssets.length === 0 && (
                       <p className="text-neutral-500 text-center py-8">No pending assets to review.</p>
                   )}
               </div>
           </div>

           {/* User Management */}
           <div className="space-y-8">
               <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                   <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                       <Coins className="w-5 h-5 text-amber-500" /> Granter Tool
                   </h2>
                   <form onSubmit={handleGiveTokens} className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-neutral-400 mb-1">User Email</label>
                           <input 
                             type="email" 
                             required
                             value={targetEmail}
                             onChange={e => setTargetEmail(e.target.value)}
                             className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500" 
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-neutral-400 mb-1">Tokens Amount</label>
                           <input 
                             type="number" 
                             required
                             min="1"
                             value={tokenAmount}
                             onChange={e => setTokenAmount(parseFloat(e.target.value) || '')}
                             className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500" 
                           />
                       </div>
                       <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                           Grant Tokens
                       </button>
                   </form>
               </div>

               <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                   <h2 className="text-xl font-bold text-white mb-6">User Database</h2>
                   <div className="space-y-3 max-h-64 overflow-y-auto">
                        {users.map(u => (
                            <div key={u.id} className="flex items-center justify-between bg-neutral-900 p-3 rounded-lg border border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                         <img src={u.avatarUrl} className="w-8 h-8 rounded-full" />
                                         {u.isVerified && <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-3 h-3 border border-neutral-900" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-sm">{u.username}</div>
                                        <div className="text-neutral-500 text-xs">{u.email} • {u.tokens} Tokens</div>
                                    </div>
                                </div>
                                {!u.isVerified && u.role !== 'owner' && (
                                    <button 
                                      onClick={() => handleVerify(u)}
                                      className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                    >
                                        <UserCheck className="w-3.5 h-3.5" /> Verify
                                    </button>
                                )}
                            </div>
                        ))}
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}
