import React, { useState } from 'react';
import { CATEGORIES, CURRENT_USER } from '../data';
import { Upload, FileText, Image, DollarSign, Tag, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Asset } from '../types';

export function UploadPage() {
  const { addAsset, user, assets } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0],
    tags: '',
    price: 0,
    previewUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const currentUploadsToday = assets?.filter(a => {
    if (a.creatorId !== user?.id) return false;
    const uploadDate = new Date(a.uploadDate);
    const today = new Date();
    return uploadDate.getDate() === today.getDate() &&
           uploadDate.getMonth() === today.getMonth() &&
           uploadDate.getFullYear() === today.getFullYear();
  }).length || 0;

  const uploadLimit = user?.isPremium ? 50 : 15;
  const canUpload = currentUploadsToday < uploadLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!canUpload) {
      alert(`You have reached your daily upload limit of ${uploadLimit} assets.`);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newAsset: Asset = {
        id: `a${Date.now()}`,
        name: formData.name,
        description: formData.description,
        creatorId: user.id,
        creatorName: user.username,
        uploadDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString(),
        category: formData.category as any,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        price: Number(formData.price),
        downloadsCount: 0,
        favoritesCount: 0,
        rating: 0,
        fileTypes: ['.rbxm', '.obj'],
        previewImages: [formData.previewUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'],
        reviews: [],
        status: 'pending' // Goes to pending for moderation
      };

      addAsset(newAsset);
      setIsSubmitting(false);
      alert('Asset uploaded successfully and is pending review!');
      navigate('/dashboard');
    }, 1500);
  };

  if (!user) return <div className="text-center py-20 text-white">Please log in to upload assets.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold text-white">Publish New Asset</h1>
           <p className="text-neutral-400 mt-2">Share your creations with the Pirate community and earn Tokens.</p>
         </div>
         <div className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-lg text-sm">
            <span className="text-neutral-400">Daily Uploads: </span>
            <span className={`font-bold ${currentUploadsToday >= uploadLimit ? 'text-red-400' : 'text-white'}`}>
              {currentUploadsToday} / {uploadLimit}
            </span>
            {!user.isPremium && (
              <div className="text-xs text-amber-500 mt-1 cursor-pointer hover:underline" onClick={() => navigate('/profile')}>
                Upgrade to Premium for 50 daily uploads
              </div>
            )}
         </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 sm:p-8">
         <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Info */}
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Asset Name</label>
                  <input 
                    type="text" 
                    required
                    maxLength={60}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Name your asset"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your asset in detail. Include features, dependencies, or setup instructions."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                     {CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                  </select>
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Price (Tokens)</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                     <input 
                       type="number" 
                       min="0"
                       required
                       value={formData.price}
                       onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                       className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                     />
                  </div>
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-neutral-300 mb-1">Tags (Comma separated)</label>
               <input 
                 type="text" 
                 placeholder="roblox, gui, modern, animated"
                 value={formData.tags}
                 onChange={e => setFormData({...formData, tags: e.target.value})}
                 className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
               />
            </div>

            {/* Simulated File Uploads */}
            <div className="pt-4 border-t border-neutral-700">
               <h3 className="text-lg font-medium text-white mb-4">Files & Previews</h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Actual file upload */}
                  <label className="border-2 border-dashed border-neutral-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-neutral-700/20 transition-colors cursor-pointer group relative">
                     <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".fbx,.gltf,.obj,.png,.jpg,.jpeg,.tga,.bmp,.gif,.mp3,.ogg,.wav,.flac,.rbxm,.rbxmx,.rbxl,.rbxlx,.mp4,.mov"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        required
                     />
                     <FileText className="w-10 h-10 text-neutral-500 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
                     <p className="text-sm text-neutral-300 font-medium">
                        {selectedFile ? selectedFile.name : 'Choose File'}
                     </p>
                     <p className="text-xs text-neutral-500 mt-1 px-4">
                        Accepts .fbx, .gltf, .obj, .png, .jpg, .jpeg, .tga, .bmp, .gif, .mp3, .ogg, .wav, .flac, .rbxm, .rbxmx, .rbxl, .rbxlx, .mp4, .mov
                     </p>
                  </label>
                  
                  {/* Placeholder for Thumbnail upload (using URL input for simplicity in MVP) */}
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Preview Image URL</label>
                        <input 
                          type="url" 
                          placeholder="https://..."
                          value={formData.previewUrl}
                          onChange={e => setFormData({...formData, previewUrl: e.target.value})}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" 
                        />
                     </div>
                     {formData.previewUrl && (
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-neutral-700">
                           <img src={formData.previewUrl} className="w-full h-full object-cover opacity-80" />
                        </div>
                     )}
                  </div>
               </div>
            </div>

             <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-4 mt-6">
               <p className="text-sm text-amber-400 font-medium flex items-center gap-2">
                 <CheckCircle className="w-4 h-4" /> Asset Approval Process
               </p>
               <p className="text-xs text-amber-500/80 mt-1">All uploaded files will be reviewed by moderation before appearing publicly.</p>
             </div>

            <div className="flex justify-end pt-4">
               <button 
                 type="button"
                 onClick={() => navigate('/dashboard')}
                 className="px-6 py-2.5 text-sm font-medium text-neutral-300 hover:text-white mr-4"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 disabled={isSubmitting}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isSubmitting ? 'Uploading...' : 'Submit for Review'}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}
