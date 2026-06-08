export type AssetCategory = 
  | 'Models' 
  | 'Meshes' 
  | 'Textures' 
  | 'UI Assets' 
  | 'Audio' 
  | 'Animations' 
  | 'Maps' 
  | 'Vehicles' 
  | 'Buildings' 
  | 'Scripts' 
  | 'VFX';

export type FileType = 
  | '.fbx' | '.gltf' | '.obj' 
  | '.png' | '.jpg' | '.jpeg' | '.tga' | '.bmp' | '.gif' 
  | '.mp3' | '.ogg' | '.wav' | '.flac' 
  | '.rbxm' | '.rbxmx' | '.rbxl' | '.rbxlx' 
  | '.mp4' | '.mov';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  tokens: number;
  isPremium: boolean;
  joinDate: string;
  role: 'owner' | 'user';
  isVerified: boolean;
  bio?: string;
  lastDailyReward?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  content: string;
  date: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  uploadDate: string;
  lastUpdatedDate: string;
  category: AssetCategory;
  tags: string[];
  price: number; // In Tokens
  downloadsCount: number;
  favoritesCount: number;
  rating: number;
  supportedVersion?: string;
  fileTypes: FileType[];
  previewImages: string[];
  reviews: Review[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'purchase' | 'review' | 'premium_expired' | 'asset_approved' | 'asset_rejected' | 'daily_reward';
  message: string;
  date: string;
  read: boolean;
}

export interface SalesData {
  date: string;
  earnings: number;
  sales: number;
}
