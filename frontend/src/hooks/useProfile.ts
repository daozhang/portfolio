import { useState, useEffect } from 'react';
import { profileService, User, UpdateProfileData } from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';

export interface UseProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  isUploading: boolean;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setError(null);
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      updateUser(updatedProfile); // Sync with AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      const avatarUrls = await profileService.uploadAvatar(file);
      
      // Update profile with new avatar URL
      if (profile) {
        const updatedProfile = {
          ...profile,
          avatar: avatarUrls.original,
        };
        setProfile(updatedProfile);
        updateUser(updatedProfile); // Sync with AuthContext
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      setError(null);
      await profileService.deleteAvatar();
      
      // Update profile to remove avatar
      if (profile) {
        const updatedProfile = {
          ...profile,
          avatar: undefined,
        };
        setProfile(updatedProfile);
        updateUser(updatedProfile); // Sync with AuthContext
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete avatar');
      throw err;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    isUploading,
    refreshProfile,
  };
};