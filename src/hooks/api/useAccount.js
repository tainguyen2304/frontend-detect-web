import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AccountService from '../../services/AccountService';
import { toast } from 'react-toastify';

const useAccount = () => {
    const queryClient = useQueryClient();

    const { data: accountList, isLoading } = useQuery({
        queryKey: AccountService.queryKeys.list(),
        queryFn: AccountService.list,
        enabled: !!AccountService.queryKeys.list && !!AccountService.list
    });

    const createAccount = useMutation({
        mutationFn: AccountService.create,
        onSuccess: (data) => {
            toast.success('Thêm thành công!');
            queryClient.invalidateQueries({
                queryKey: AccountService.queryKeys.list()
            });
            return data
        },
        onError: () => {
            toast.error('Thêm thất bại!');
        }
    });

    const updateAccount = useMutation({
        mutationFn: AccountService.update,
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({
                queryKey: AccountService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Cập nhật thất bại!');
        }
    });

    const deleteAccount = useMutation({
        mutationFn: AccountService.delete,
        onSuccess: () => {
            toast.success('Xóa thành công!');
            queryClient.invalidateQueries({
                queryKey: AccountService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Xóa thất bại!');
        }
    });


    return { createAccount, updateAccount, deleteAccount, accountList, isLoading }
};

export default useAccount;