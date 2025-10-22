// In production (single service), API is at /api
// In development, Vite proxy forwards /api to localhost:5000
const API_URL = '/api';

class ApiClient {
  private getHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  }

  async verify() {
    return this.request('/auth/verify', { method: 'POST' });
  }

  logout() {
    localStorage.removeItem('admin_token');
  }

  // Team Members
  async getTeamMembers() {
    return this.request('/team');
  }

  async getTeamMember(id: string) {
    return this.request(`/team/${id}`);
  }

  async createTeamMember(data: any) {
    return this.request('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeamMember(id: string, data: any) {
    return this.request(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeamMember(id: string) {
    return this.request(`/team/${id}`, { method: 'DELETE' });
  }

  // Advantages
  async getAdvantages() {
    return this.request('/advantages');
  }

  async getAdvantage(id: string) {
    return this.request(`/advantages/${id}`);
  }

  async createAdvantage(data: any) {
    return this.request('/advantages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdvantage(id: string, data: any) {
    return this.request(`/advantages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdvantage(id: string) {
    return this.request(`/advantages/${id}`, { method: 'DELETE' });
  }

  // Stats
  async getStats() {
    return this.request('/stats');
  }

  async getStat(id: string) {
    return this.request(`/stats/${id}`);
  }

  async createStat(data: any) {
    return this.request('/stats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStat(id: string, data: any) {
    return this.request(`/stats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStat(id: string) {
    return this.request(`/stats/${id}`, { method: 'DELETE' });
  }

  // Content
  async getContent() {
    return this.request('/content');
  }

  async getContentBySection(section: string) {
    return this.request(`/content/${section}`);
  }

  async updateContent(section: string, data: any) {
    return this.request(`/content/${section}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Applications
  async submitApplication(data: { name: string; phone: string; email: string }) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApplications() {
    return this.request('/applications');
  }

  async getApplication(id: string) {
    return this.request(`/applications/${id}`);
  }

  async updateApplication(id: string, data: any) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id: string) {
    return this.request(`/applications/${id}`, { method: 'DELETE' });
  }

  async resendApplicationToTelegram(id: string) {
    return this.request(`/applications/${id}/resend`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();

