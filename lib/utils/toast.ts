import { toast as sonnerToast } from "sonner";

/**
 * Toast utility functions for displaying notifications
 * Auto-dismisses after 5 seconds by default
 * Supports manual dismiss and stacking
 */

export const toast = {
  /**
   * Display a success toast notification
   * @param message - The message to display
   * @param options - Optional configuration
   */
  success: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration ?? 5000,
    });
  },

  /**
   * Display an error toast notification
   * @param message - The error message to display
   * @param options - Optional configuration
   */
  error: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration ?? 5000,
    });
  },

  /**
   * Display a warning toast notification
   * @param message - The warning message to display
   * @param options - Optional configuration
   */
  warning: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? 5000,
    });
  },

  /**
   * Display an info toast notification
   * @param message - The info message to display
   * @param options - Optional configuration
   */
  info: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration ?? 5000,
    });
  },

  /**
   * Display a loading toast notification
   * @param message - The loading message to display
   * @param options - Optional configuration
   */
  loading: (message: string, options?: { description?: string }) => {
    return sonnerToast.loading(message, {
      description: options?.description,
    });
  },

  /**
   * Dismiss a specific toast by ID
   * @param toastId - The ID of the toast to dismiss
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /**
   * Display a promise toast that updates based on promise state
   * @param promise - The promise to track
   * @param messages - Messages for loading, success, and error states
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};
