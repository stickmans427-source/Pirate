import { Asset, User, Notification, SalesData } from './types';

export const CURRENT_USER: User | null = null;

export const INITIAL_USERS: User[] = [
    {
      id: 'owner1',
      username: 'Stickmans',
      email: 'Stickmans427@gmail.com',
      avatarUrl: 'https://i.pinimg.com/originals/19/76/9c/19769cc33d2d3a29620cb15caa918feb.jpg?nii=t',
      tokens: 999999,
      isPremium: true,
      joinDate: '2023-01-15T00:00:00Z',
      role: 'owner',
      isVerified: true,
      bio: 'Owner and Creator of Pirate.'
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [];

export const MOCK_ASSETS: Asset[] = [];

export const MOCK_SALES_DATA: SalesData[] = [];

export const CATEGORIES = [
  'Models', 'Meshes', 'Textures', 'UI Assets', 'Audio', 
  'Animations', 'Maps', 'Vehicles', 'Buildings', 'Scripts', 'VFX'
];
