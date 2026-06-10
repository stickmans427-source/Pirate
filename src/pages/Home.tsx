import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AssetCard } from '../components/AssetCard';
import { CATEGORIES } from '../data';
import { Filter, SlidersHorizontal, ArrowDownAZ } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { assets } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showHero, setShowHero] = useState(true);

  const filteredAssets = assets
    .filter(a => a.status === 'approved')
    .filter(a => !activeCategory || a.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (sortBy === 'popular') return b.downloadsCount - a.downloadsCount;
      if (sortBy === 'favorites') return b.favoritesCount - a.favoritesCount;
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {showHero && (
        <div className="relative rounded-2xl overflow-hidden bg-indigo-900 border border-indigo-500/30 mb-8 aspect-[21/9] sm:aspect-[21/6]">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-8 sm:px-16 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">Roblox</span> Asset Marketplace
            </h1>
            <p className="text-lg text-neutral-300 mb-6">
              Discover, buy, and sell high-quality models, scripts, audio, and UI elements.
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={() => setShowHero(false)}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
               >
                 Explore Assets
               </button>
               <button 
                 onClick={() => navigate('/dashboard')}
                 className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
               >
                 Start Selling
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!activeCategory ? 'bg-indigo-600/20 text-indigo-400' : 'text-neutral-300 hover:bg-neutral-800'}`}
              >
                All Categories
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category ? 'bg-indigo-600/20 text-indigo-400' : 'text-neutral-300 hover:bg-neutral-800'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
             <h4 className="font-medium text-white mb-2 flex items-center gap-2"><ArrowDownAZ className="w-4 h-4 text-indigo-400"/> Sort By</h4>
             <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:ring-1 focus:ring-indigo-500 outline-none"
             >
               <option value="newest">Newest First</option>
               <option value="popular">Most Popular</option>
               <option value="favorites">Most Favorited</option>
               <option value="priceAsc">Price: Low to High</option>
               <option value="priceDesc">Price: High to Low</option>
             </select>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {activeCategory ? activeCategory : 'For You'}
            </h2>
            <span className="text-sm text-neutral-400">{filteredAssets.length} results</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
          
          {filteredAssets.length === 0 && (
             <div className="text-center py-20 bg-neutral-800/20 rounded-xl border border-neutral-800 border-dashed">
                <p className="text-neutral-400">No assets found for the selected criteria.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
