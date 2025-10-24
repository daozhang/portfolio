import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface MediaFileUrls {
  original: string;
  thumbnail: string;
  mobile: string;
  desktop: string;
}

export interface MediaFileMetadata {
  size: number;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ProjectDetails {
  title: string;
  description?: string;
  tags?: string[];
  year?: number;
}

export interface MediaFile {
  id: string;
  userId: string;
  portfolioId?: string;
  originalName: string;
  urls: MediaFileUrls;
  metadata: MediaFileMetadata;
  projectDetails?: ProjectDetails;
  createdAt: string;
}

export interface UploadMediaData {
  title?: string;
  description?: string;
  tags?: string[];
  year?: number;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  portfolioId?: string;
  search?: string;
}

export interface MediaListResponse {
  files: MediaFile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class MediaService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async uploadMedia(file: File, projectDetails?: UploadMediaData): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (projectDetails) {
      if (projectDetails.title) formData.append('title', projectDetails.title);
      if (projectDetails.description) formData.append('description', projectDetails.description);
      if (projectDetails.tags) formData.append('tags', projectDetails.tags.join(','));
      if (projectDetails.year) formData.append('year', projectDetails.year.toString());
    }

    const response = await axios.post(`${API_BASE_URL}/media/upload`, formData, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  async getMediaFiles(params?: MediaQueryParams): Promise<MediaListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.portfolioId) queryParams.append('portfolioId', params.portfolioId);
    if (params?.search) queryParams.append('search', params.search);

    const response = await axios.get(`${API_BASE_URL}/media?${queryParams.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  }

  async getMediaFile(id: string): Promise<MediaFile> {
    const response = await axios.get(`${API_BASE_URL}/media/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  }

  async updateProjectDetails(id: string, projectDetails: ProjectDetails): Promise<MediaFile> {
    const response = await axios.put(`${API_BASE_URL}/media/${id}/project-details`, projectDetails, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  }

  async assignToPortfolio(id: string, portfolioId: string): Promise<MediaFile> {
    const response = await axios.put(`${API_BASE_URL}/media/${id}/assign-portfolio/${portfolioId}`, {}, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  }

  async removeFromPortfolio(id: string): Promise<MediaFile> {
    const response = await axios.put(`${API_BASE_URL}/media/${id}/remove-from-portfolio`, {}, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  }

  async deleteMediaFile(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/media/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

export const mediaService = new MediaService();