import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatTokens } from '../utils';
import { Star, Download, Heart, Play, ShieldAlert, AlertTriangle, FileCode } from 'lucide-react';
import { useState } from 'react';

export function AssetDetails() {
  const { id } = useParams<{ id: string }>();
  const { assets, purchaseAsset, user } = useAppContext();
  const asset = assets.find(a => a.id === id);
  const [activePreview, setActivePreview] = useState(0);

  if (!asset) {
    return <div className="text-center text-white py-20">Asset not found</div>;
  }

  const handlePurchase = () => {
    if (purchaseAsset(asset.id)) {
      alert(`Successfully purchased ${asset.name}! Tokens deducted.`);
    } else {
      alert('Failed to purchase. Insufficient Tokens or not logged in.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb would go here */}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Preview Gallery - Asset Preview System */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-700">
            <div className="aspect-video relative group flex items-center justify-center bg-black">
              {asset.category === 'Audio' ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                     <Play className="w-10 h-10 text-white ml-2" />
                  </div>
                  <div className="text-neutral-400 font-mono">0:00 / 2:34</div>
                </div>
              ) : (
                <img 
                  src={asset.previewImages[activePreview]} 
                  alt={asset.name} 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            {asset.previewImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-neutral-800">
                {asset.previewImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActivePreview(idx)}
                    className={`flex-shrink-0 w-24 aspect-video rounded-md overflow-hidden border-2 ${activePreview === idx ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
            <p className="text-neutral-300 whitespace-pre-line">{asset.description}</p>
          </div>

          <div>
             <h2 className="text-2xl font-bold text-white mb-4">Reviews & Ratings</h2>
             <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-bold text-white">{asset.rating.toFixed(1)}</div>
                <div className="space-y-1">
                   <div className="flex text-amber-500">
                     {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                   </div>
                   <div className="text-sm text-neutral-400">Based on {asset.reviews.length || 1} review(s)</div>
                </div>
             </div>
             
             <div className="space-y-4">
               {asset.reviews.map(review => (
                 <div key={review.id} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-3">
                       <img src={review.userAvatar} className="w-10 h-10 rounded-full bg-neutral-700" />
                       <div>
                         <div className="font-medium text-white">{review.userName}</div>
                         <div className="flex items-center gap-2">
                           <div className="flex text-amber-500">
                             {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-neutral-600'}`} />)}
                           </div>
                           <span className="text-xs text-neutral-500">{new Date(review.date).toLocaleDateString()}</span>
                         </div>
                       </div>
                    </div>
                    <p className="text-neutral-300 text-sm">{review.content}</p>
                 </div>
               ))}
               {asset.reviews.length === 0 && <p className="text-neutral-500">No reviews yet.</p>}
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 sticky top-24">
             <h1 className="text-2xl font-bold text-white mb-2">{asset.name}</h1>
             <div className="text-indigo-400 font-medium mb-6">By {asset.creatorName}</div>
             
             <div className="flex items-center gap-2 text-3xl font-bold text-white mb-6 bg-neutral-900 p-4 rounded-lg border border-neutral-700">
               <span className="text-amber-400">â</span> {formatTokens(asset.price)}
             </div>

             <button 
               onClick={handlePurchase}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-bold text-lg mb-3 flex justify-center items-center gap-2 transition-colors"
             >
               <Download className="w-5 h-5" />
               Purchase & Download
             </button>
             
             <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 px-4 rounded-lg font-medium text-sm mb-6 flex justify-center items-center gap-2 transition-colors">
               <Heart className="w-4 h-4" /> Add to Favorites
             </button>
             
             <div className="space-y-3 pt-6 border-t border-neutral-700 text-sm">
                <div className="flex justify-between">
                   <span className="text-neutral-400">Category</span>
                   <span className="text-white font-medium">{asset.category}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-neutral-400">Supported Version</span>
                   <span className="text-white font-medium">{asset.supportedVersion || 'All Versions'}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-neutral-400">Uploaded</span>
                   <span className="text-white font-medium">{new Date(asset.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-neutral-400">Updated</span>
                   <span className="text-white font-medium">{new Date(asset.lastUpdatedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-neutral-400">File Type(s)</span>
                   <span className="text-white font-medium flex gap-1">
                      {asset.fileTypes.map(f => f.toUpperCase()).join(', ')}
                   </span>
                </div>
             </div>
             
             <div className="mt-6 pt-6 border-t border-neutral-700">
                <div className="flex flex-wrap gap-2">
                   {asset.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-300">
                         #{tag}
                      </span>
                   ))}
                </div>
             </div>

             <div className="mt-8 space-y-2">
                <button className="w-full flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-red-400 transition-colors py-2 border border-transparent hover:border-red-900 rounded bg-transparent hover:bg-red-950/30">
                  <AlertTriangle className="w-3.5 h-3.5" /> Report Asset for DMCA/TOS Violation
                </button>
             </div>
          </div>
          

        </div>
      </div>
    </div>
  );
}
