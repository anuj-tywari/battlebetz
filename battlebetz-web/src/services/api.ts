import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from localStorage in client-side code
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User APIs
export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  // Get user by ID
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (data: any) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
  
  // Get user bets
  getUserBets: async (id: string, page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const response = await api.get(`/users/${id}/bets?${params.toString()}`);
    return response.data;
  },
  
  // Get user tournaments
  getUserTournaments: async (id: string, page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const response = await api.get(`/users/${id}/tournaments?${params.toString()}`);
    return response.data;
  }
};

// Auth APIs
export const authApi = {
  // Register a new user
  register: async (email: string, password: string, username: string) => {
    const response = await api.post('/auth/register', { email, password, username });
    return response.data;
  },
  
  // Login a user
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
};

// Bet APIs
export const betApi = {
  // Get a bet by ID
  getBetById: async (id: string) => {
    const response = await api.get(`/bets/${id}`);
    return response.data;
  },
  
  // Create a new bet
  createBet: async (betData: any) => {
    const response = await api.post('/bets', betData);
    return response.data;
  },
  
  // Cancel a bet
  cancelBet: async (id: string) => {
    const response = await api.post(`/bets/${id}/cancel`);
    return response.data;
  },
  
  // Get recent bets
  getRecentBets: async (page = 1, limit = 10, userId?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (userId) params.append('userId', userId);
    
    const response = await api.get(`/bets/recent?${params.toString()}`);
    return response.data;
  },
  
  // Calculate potential payout
  calculatePayout: async (risk: number, selections: any[], betType: number) => {
    const response = await api.post('/bets/calculate', { risk, selections, betType });
    return response.data;
  }
};

// Tournament APIs
export const tournamentApi = {
  // Get all tournaments
  getTournaments: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const response = await api.get(`/tournaments?${params.toString()}`);
    return response.data;
  },
  
  // Get a tournament by ID
  getTournamentById: async (id: string) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },
  
  // Get tournament participants
  getTournamentParticipants: async (id: string, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/tournaments/${id}/participants?${params.toString()}`);
    return response.data;
  },
  
  // Join a tournament
  joinTournament: async (id: string) => {
    const response = await api.post(`/tournaments/${id}/join`);
    return response.data;
  },
  
  // Get tournament leaderboard
  getTournamentLeaderboard: async (id: string, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/tournaments/${id}/leaderboard?${params.toString()}`);
    return response.data;
  },
  
  // Get tournament rounds
  getTournamentRounds: async (id: string) => {
    const response = await api.get(`/tournaments/${id}/rounds`);
    return response.data;
  },
  
  // Get user's progress in tournament
  getUserTournamentProgress: async (id: string) => {
    const response = await api.get(`/tournaments/${id}/progress`);
    return response.data;
  }
}; 