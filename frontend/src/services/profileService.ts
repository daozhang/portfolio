import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  role: 'artist' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
}

export interface OptimizedAvatar {
  original: string;
  thumbnail: string;
}

class ProfileService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getProfile(): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await axios.put(`${API_BASE_URL}/profile`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async uploadAvatar(file: File): Promise<OptimizedAvatar> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axios.post(`${API_BASE_URL}/profile/avatar`, formData, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAvatar(): Promise<void> {
    await axios.delete(`${API_BASE_URL}/profile/avatar`, {
      headers: this.getAuthHeaders(),
    });
  }
}

export const profileService = new ProfileService();