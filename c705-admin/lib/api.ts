const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface AdminLoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    artists: number;
    journalists: number;
    producers: number;
    totalArticles: number;
    totalCyphers: number;
    activeCyphers: number;
    totalBeats: number;
  };
  trendingCyphers: Array<{
    id: string;
    title: string;
    entryCount: number;
    createdAt: string;
  }>;
}

export interface Report {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  entry?: {
    id: string;
    user: {
      username: string;
      email: string;
    };
    cypher: {
      id: string;
      title: string;
    };
  };
  cypher?: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RecentCypher {
  id: string;
  title: string;
  artist: string;
  beatType: string;
  entryCount: number;
  playCount: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  host: {
    username: string | null;
  };
}

export interface JournalistInvite {
  id: string;
  email: string | null;
  accessCode: string;
  used: boolean;
  expiresAt: string | null;
  createdAt: string;
  usedAt: string | null;
  usedBy: string | null;
}

export interface CreateInviteDto {
  email?: string;
  expiresAt?: string;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    return this.request<AdminLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Admin endpoints
  async getDashboard(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/admin/dashboard');
  }

  async getJournalists() {
    return this.request('/admin/journalists');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getAdminInfo() {
    return this.request('/admin/me');
  }

  // Journalist invites
  async createInvite(data: CreateInviteDto): Promise<JournalistInvite> {
    return this.request<JournalistInvite>('/journalist-invites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllInvites(): Promise<JournalistInvite[]> {
    return this.request<JournalistInvite[]>('/journalist-invites');
  }

  async getUnusedInvites(): Promise<JournalistInvite[]> {
    return this.request<JournalistInvite[]>('/journalist-invites/unused');
  }

  // Articles
  async getArticles(page = 1, limit = 20) {
    return this.request(`/articles?page=${page}&limit=${limit}`);
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, { method: 'DELETE' });
  }

  // Cyphers
  async getCyphers(page = 1, limit = 20) {
    return this.request(`/cyphers?page=${page}&limit=${limit}`);
  }

  async getCypherById(id: string) {
    return this.request(`/cyphers/${id}`);
  }

  // Content moderation
  async getReports(): Promise<Report[]> {
    return this.request<Report[]>('/admin/reports');
  }

  async resolveReport(reportId: string, action: 'dismiss' | 'resolve') {
    return this.request(`/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async deleteCypher(cypherId: string) {
    return this.request(`/admin/cyphers/${cypherId}`, {
      method: 'DELETE',
    });
  }

  async unpublishArticle(articleId: string) {
    return this.request(`/admin/articles/${articleId}`, {
      method: 'DELETE',
    });
  }

  async getRecentCyphers(limit: number = 4): Promise<RecentCypher[]> {
    return this.request<RecentCypher[]>(`/admin/recent-cyphers?limit=${limit}`);
  }

  async getEvents(limit: number = 6): Promise<Event[]> {
    return this.request<Event[]>(`/admin/events?limit=${limit}`);
  }
}

export const api = new ApiClient();
