import axios from 'axios';
import { LoginCredentials, User } from '@/types/auth';

// Use Next.js API routes for authentication to handle httpOnly cookies
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await axios.post('/api/auth/logout');
  },

  /**
   * Refresh the JWT token
   */
  refreshToken: async (): Promise<{ user: User }> => {
    const response = await axios.post('/api/auth/refresh');
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get('/api/auth/me');
    return response.data;
  },
};
