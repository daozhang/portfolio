import { Portfolio, Block, TemplateType } from '../types/blocks';

const API_BASE_URL = 'http://localhost:3001';

export interface CreatePortfolioRequest {
  title: string;
  template?: TemplateType;
  theme?: string;
}

export interface UpdatePortfolioRequest {
  title?: string;
  template?: TemplateType;
  blocks?: Block[];
  theme?: string;
}

export interface PublishPortfolioRequest {
  isPublished: boolean;
}

export interface AddBlockRequest {
  type: Block['type'];
  data: Block['data'];
}

export interface UpdateBlockRequest {
  type?: Block['type'];
  data?: Block['data'];
  position?: number;
}

export interface ReorderBlocksRequest {
  blockIds: string[];
}

class PortfolioService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async createPortfolio(data: CreatePortfolioRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create portfolio');
    }

    const result = await response.json();
    return result.data;
  }

  async getUserPortfolios(): Promise<Portfolio[]> {
    const response = await fetch(`${API_BASE_URL}/portfolios`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolios');
    }

    const result = await response.json();
    return result.data;
  }

  async getPortfolio(id: string): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolio');
    }

    const result = await response.json();
    return result.data;
  }

  async updatePortfolio(id: string, data: UpdatePortfolioRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update portfolio');
    }

    const result = await response.json();
    return result.data;
  }

  async publishPortfolio(id: string, data: PublishPortfolioRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}/publish`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to publish portfolio');
    }

    const result = await response.json();
    return result.data;
  }

  async duplicatePortfolio(id: string): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}/duplicate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to duplicate portfolio');
    }

    const result = await response.json();
    return result.data;
  }

  async deletePortfolio(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete portfolio');
    }
  }

  // Block management methods
  async addBlock(portfolioId: string, data: AddBlockRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/blocks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add block');
    }

    const result = await response.json();
    return result.data;
  }

  async updateBlock(portfolioId: string, blockId: string, data: UpdateBlockRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/blocks/${blockId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update block');
    }

    const result = await response.json();
    return result.data;
  }

  async removeBlock(portfolioId: string, blockId: string): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/blocks/${blockId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove block');
    }

    const result = await response.json();
    return result.data;
  }

  async reorderBlocks(portfolioId: string, data: ReorderBlocksRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/blocks/reorder`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to reorder blocks');
    }

    const result = await response.json();
    return result.data;
  }

  // Public portfolio methods (no authentication required)
  async getPublicPortfolioByUrl(publicUrl: string): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/public/url/${publicUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch public portfolio');
    }

    const result = await response.json();
    return result.data;
  }

  async getPublicPortfolioById(id: string): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/public/id/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch public portfolio');
    }

    const result = await response.json();
    return result.data;
  }
}

export const portfolioService = new PortfolioService();