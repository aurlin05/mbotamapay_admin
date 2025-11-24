import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, getUserById, getUserTransactions, banUser, unbanUser } from '@/lib/api/users';
import type { UserFilters } from '@/types/user';
import { toast } from '@/lib/utils/toast';

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => getAllUsers(filters),
  });
}

export function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}

export function useUserTransactions(userId: number) {
  return useQuery({
    queryKey: ['user-transactions', userId],
    queryFn: () => getUserTransactions(userId),
    enabled: !!userId,
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User banned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to ban user');
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User unbanned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to unban user');
    },
  });
}
