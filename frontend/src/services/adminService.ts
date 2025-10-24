import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface InviteCode {
  code: string;
  isActive: boolean;
  isUsed: boolean;
  createdBy: string;
  usedBy?: string;
  createdAt: string;
  usedAt?: string;
  creator: {
    id: string;
    email: string;
    name?: string;
  };
  usedByUser?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface UserStats {
  id: string;
  email: string;
  name?: string;
  role: 'artist' | 'admin';
  portfolioCount: number;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalAdmins: number;
  totalPortfolios: number;
  totalInviteCodes: number;
  usedInviteCodes: number;
  activeInviteCodes: number;
  recentUsers: UserStats[];
}

export interface CreateAdminData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRoleData {
  role: 'artist' | 'admin';
}

class AdminService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Dashboard
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Invite Codes
  async generateInviteCode(): Promise<{ code: string }> {
    const response = await axios.post(`${API_BASE_URL}/admin/invite-codes`, {}, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getAllInviteCodes(): Promise<InviteCode[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/invite-codes`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deactivateInviteCode(code: string): Promise<void> {
    await axios.put(`${API_BASE_URL}/admin/invite-codes/deactivate`, 
      { code }, 
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // User Management
  async getAllUsers(): Promise<UserStats[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateUserRole(userId: string, role: 'artist' | 'admin'): Promise<void> {
    await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, 
      { role }, 
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  async createAdminUser(data: CreateAdminData): Promise<UserStats> {
    const response = await axios.post(`${API_BASE_URL}/admin/users/admin`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const adminService = new AdminService();