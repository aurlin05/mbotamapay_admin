import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/lib/utils/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Maximum number of retry attempts for transient errors
const MAX_RETRIES = 3;
// Initial delay for exponential backoff (in milliseconds)
const INITIAL_RETRY_DELAY = 1000;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// Helper function to determine if an error is retryable
function isRetryableError(error: AxiosError): boolean {
  // Retry on network errors (no response)
  if (!error.response) {
    return true;
  }
  
  // Retry on specific 5xx errors (server errors)
  const status = error.response.status;
  return status === 502 || status === 503 || status === 504;
}

// Helper function to calculate exponential backoff delay
function getRetryDelay(retryCount: number): number {
  return INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
}

// Helper function to sleep for a given duration
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is stored in httpOnly cookie, so it's automatically sent
    // We can add additional headers here if needed
    
    // Initialize retry count if not present
    if (!config.headers['X-Retry-Count']) {
      config.headers['X-Retry-Count'] = '0';
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and implement retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    
    // Initialize retry count
    if (!config._retryCount) {
      config._retryCount = 0;
    }
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      // Preserve the current path for post-login redirect
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      toast.error('Your session has expired. Please login again.');
      
      if (typeof window !== 'undefined') {
        // Preserve intended destination
        const loginUrl = `/login?from=${encodeURIComponent(currentPath)}`;
        window.location.href = loginUrl;
      }
      return Promise.reject(error);
    } else if (error.response?.status === 403) {
      // Insufficient permissions
      toast.error('You do not have permission to perform this action');
      return Promise.reject(error);
    } else if (error.response?.status === 429) {
      // Rate limiting
      toast.warning('Too many requests. Please wait before trying again');
      return Promise.reject(error);
    } else if (error.response?.status && error.response.status >= 500) {
      // Server error - show error message
      const errorMessage = error.response.status === 503 
        ? 'Service temporarily unavailable. Please try again later'
        : 'Server error. Please try again later';
      
      // Only show toast on first attempt to avoid spam
      if (config._retryCount === 0) {
        toast.error(errorMessage);
      }
      
      // Attempt retry for retryable errors
      if (isRetryableError(error) && config._retryCount < MAX_RETRIES) {
        config._retryCount++;
        const delay = getRetryDelay(config._retryCount - 1);
        
        console.log(`Retrying request (attempt ${config._retryCount}/${MAX_RETRIES}) after ${delay}ms...`);
        
        await sleep(delay);
        return apiClient(config);
      }
      
      return Promise.reject(error);
    } else if (!error.response) {
      // Network error - show error message
      if (config._retryCount === 0) {
        toast.error('Network error. Please check your connection');
      }
      
      // Attempt retry for network errors
      if (config._retryCount < MAX_RETRIES) {
        config._retryCount++;
        const delay = getRetryDelay(config._retryCount - 1);
        
        console.log(`Retrying request (attempt ${config._retryCount}/${MAX_RETRIES}) after ${delay}ms...`);
        
        await sleep(delay);
        return apiClient(config);
      }
      
      return Promise.reject(error);
    }
    
    // For other errors, reject without retry
    return Promise.reject(error);
  }
);
