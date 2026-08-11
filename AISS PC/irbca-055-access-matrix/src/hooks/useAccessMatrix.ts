import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MatrixRowData } from '../components/admin/AccessMatrixAdminPanel';

export function useAccessMatrix(tenantId: string, userId: string) {
  const queryClient = useQueryClient();

  const matrixQuery = useQuery<MatrixRowData[]>({
    queryKey: ['matrix', tenantId, userId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/matrix/${userId}`, {
        headers: { 'X-Tenant-ID': tenantId },
      });
      if (!res.ok) throw new Error('Failed to fetch access matrix');
      const data = await res.json();
      return data.roles;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ roleId, nextState }: { roleId: string; nextState: boolean }) => {
      const res = await fetch('/api/v1/matrix/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({
          user_id: userId,
          role_id: roleId,
          assigned: nextState,
          session_id: `SESS-${Date.now()}`,
        }),
      });
      if (!res.ok) throw new Error('Failed to update role assignment');
      return res.json();
    },
    onMutate: async ({ roleId, nextState }) => {
      await queryClient.cancelQueries({ queryKey: ['matrix', tenantId, userId] });
      const previous = queryClient.getQueryData<MatrixRowData[]>(['matrix', tenantId, userId]);
      if (previous) {
        queryClient.setQueryData<MatrixRowData[]>(
          ['matrix', tenantId, userId],
          previous.map((item) =>
            item.roleId === roleId
              ? { ...item, assigned: nextState, status: nextState ? 'ACTIVE' : 'SUSPENDED' }
              : item
          )
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['matrix', tenantId, userId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matrix', tenantId, userId] });
    },
  });

  return {
    matrixData: matrixQuery.data || [],
    isLoading: matrixQuery.isLoading,
    isError: matrixQuery.isError,
    toggleRole: (roleId: string, nextState: boolean) =>
      toggleMutation.mutateAsync({ roleId, nextState }),
  };
}
