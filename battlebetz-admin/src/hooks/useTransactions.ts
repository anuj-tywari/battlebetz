// hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, getTransactionById, createTransaction, updateTransactionStatus } from '@/services/transactionService';
import { Transaction } from '@/types/transaction';

export function useTransactions(filters: { userId?: string, type?: string } = {}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
  });
}

export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => 
      createTransaction(transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ transactionId, status }: 
      { transactionId: string, status: 'pending' | 'completed' | 'failed' }) => 
      updateTransactionStatus(transactionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
    },
  });
}
