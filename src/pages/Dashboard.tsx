import { useAppContext } from '../context/AppContext';
import { MOCK_SALES_DATA } from '../data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, Coins, TrendingUp, Package, Edit, Trash2, Eye } from 'lucide-react';
import { formatTokens } from '../utils';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, assets } = useAppContext();
  
  // Filter assets to only those owned by current user
  const myAssets = assets.filter(a => a.creatorId === user?.id);

  if (!user) return <div className="text-center py-20 text-white">Please log in to view dashboard.</div>;

  const totalEarnings = MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalSales = MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
           <p className="text-neutral-400 mt-1">Welcome back, {user.username}. Here's your performance.</p>
        </div>
        <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
           <Package className="w-5 h-5" /> Upload New Asset
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
               <div className="bg-amber-500/20 p-3 rounded-lg text-amber-400">
                  <Coins className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-sm font-medium text-neutral-400">Total Earnings (7d)</p>
                  <p className="text-2xl font-bold text-white">{formatTokens(totalEarnings)}</p>
               </div>
            </div>
         </div>
         <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
               <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400">
                  <TrendingUp className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-sm font-medium text-neutral-400">Total Sales (7d)</p>
                  <p className="text-2xl font-bold text-white">{totalSales}</p>
               </div>
            </div>
         </div>
         <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
               <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                  <Package className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-sm font-medium text-neutral-400">Active Listings</p>
                  <p className="text-2xl font-bold text-white">{myAssets.length}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Charts Section */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
         <h2 className="text-lg font-bold text-white mb-6">Earnings Overview</h2>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_SALES_DATA}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                 <XAxis dataKey="date" stroke="#a3a3a3" tick={{fill: '#a3a3a3', fontSize: 12}} axisLine={false} tickLine={false} />
                 <YAxis stroke="#a3a3a3" tick={{fill: '#a3a3a3', fontSize: 12}} axisLine={false} tickLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff', borderRadius: '8px' }}
                   itemStyle={{ color: '#fbbf24' }}
                 />
                 <Bar dataKey="earnings" fill="#6366f1" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Asset Management */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
         <div className="p-6 border-b border-neutral-700">
            <h2 className="text-lg font-bold text-white">Manage Assets</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
               <thead className="bg-neutral-900 border-b border-neutral-700 text-xs uppercase">
                  <tr>
                     <th className="px-6 py-4 font-medium">Asset Name</th>
                     <th className="px-6 py-4 font-medium">Status</th>
                     <th className="px-6 py-4 font-medium">Price</th>
                     <th className="px-6 py-4 font-medium">Downloads</th>
                     <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-700">
                  {myAssets.map(asset => (
                     <tr key={asset.id} className="hover:bg-neutral-700/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                           <img src={asset.previewImages[0]} className="w-10 h-10 rounded border border-neutral-600 object-cover" />
                           {asset.name}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              asset.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              asset.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                           }`}>
                              {asset.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-amber-400">{asset.price} T</td>
                        <td className="px-6 py-4">{asset.downloadsCount}</td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                           <Link to={`/asset/${asset.id}`} className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-neutral-300 transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                           </Link>
                           <button className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-md text-indigo-400 transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md text-red-400 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
                  {myAssets.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                           You haven't uploaded any assets yet.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>



    </div>
  );
}
