import { useState, useCallback } from 'react';
import { 
  mediaService, 
  MediaFile, 
  UploadMediaData, 
  MediaQueryParams, 
  MediaListResponse,
  ProjectDetails 
} from '../services/mediaService';

export const useMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMedia = useCallback(async (file: File, projectDetails?: UploadMediaData): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mediaService.uploadMedia(file, projectDetails);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload media');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMediaFiles = useCallback(async (params?: MediaQueryParams): Promise<MediaListResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mediaService.getMediaFiles(params);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch media files');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMediaFile = useCallback(async (id: string): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mediaService.getMediaFile(id);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch media file');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectDetails = useCallback(async (id: string, projectDetails: ProjectDetails): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mediaService.updateProjectDetails(id, projectDetails);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMediaFile = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await mediaService.deleteMediaFile(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete media file');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignToPortfolio = useCallback(async (id: string, portfolioId: string): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mediaService.assignToPortfolio(id, portfolioId);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign to portfolio');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromPortfolio = useCallback(async (id: string): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mediaService.removeFromPortfolio(id);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove from portfolio');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadMedia,
    getMediaFiles,
    getMediaFile,
    updateProjectDetails,
    deleteMediaFile,
    assignToPortfolio,
    removeFromPortfolio,
  };
};