import React from 'react';
import { Link } from 'react-router-dom';
import { Asset } from '../types';
import { Star, Download, Heart } from 'lucide-react';
import { cn, formatTokens } from '../utils';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <Link to={`/asset/${asset.id}`} className="group flex flex-col bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="relative aspect-video bg-neutral-900 overflow-hidden">
        <img 
          src={asset.previewImages[0]} 
          alt={asset.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-white flex items-center gap-1 border border-neutral-700">
          <span className="text-amber-400">â</span> {formatTokens(asset.price)}
        </div>
        <div className="absolute top-2 left-2 bg-indigo-600/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white">
          {asset.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {asset.name}
        </h3>
        <p className="text-sm text-neutral-400 mt-1 h-5">{asset.creatorName}</p>
        
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-medium text-neutral-300">{asset.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 tooltip" title="Downloads">
              <Download className="w-3.5 h-3.5" />
              <span>{asset.downloadsCount > 1000 ? (asset.downloadsCount/1000).toFixed(1)+'k' : asset.downloadsCount}</span>
            </div>
          </div>
          <div className="flex gap-1">
             {asset.fileTypes.slice(0,2).map(ft => (
                <span key={ft} className="px-1.5 py-0.5 rounded bg-neutral-700 text-[10px] uppercase">{ft.replace('.','')}</span>
             ))}
             {asset.fileTypes.length > 2 && <span className="px-1.5 py-0.5 rounded bg-neutral-700 text-[10px]">+{asset.fileTypes.length-2}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
