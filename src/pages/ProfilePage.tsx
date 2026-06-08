import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, User as UserIcon, Shield, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, updateProfile } = useAppContext();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(bio, avatarUrl);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-900 relative">
        </div>
        
        <div className="px-8 pb-8 relative pt-16">
          <div className="absolute -top-16 left-8">
            <div className="relative">
              <img 
                src={avatarUrl} 
                className="w-32 h-32 rounded-full border-4 border-neutral-800 object-cover bg-neutral-900"
                alt="Profile"
              />
              {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full border-4 border-neutral-800 w-8 h-8 flex items-center justify-center">
                      <span className="text-sm text-white">✓</span>
                  </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                {user.username}
                {user.role === 'owner' && (
                  <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded flex items-center gap-1 uppercase tracking-wider font-bold">
                    <Shield className="w-3.5 h-3.5" /> Owner
                  </span>
                )}
              </h1>
              <p className="text-neutral-400 mt-1">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Avatar Image URL</label>
                <input 
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Bio Description</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 h-32"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setBio(user.bio || '');
                    setAvatarUrl(user.avatarUrl || '');
                  }}
                  className="px-4 py-2 text-neutral-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="prose prose-invert">
              <p className="text-neutral-300 min-h-[4rem]">{user.bio || 'No bio provided yet.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
