import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClassListService } from '../../services/ClassLIstService';
import { toast } from 'react-toastify';
import { useMemo } from 'react';

const useClassList = () => {
    const queryClient = useQueryClient();

    const { data: classList, isLoading } = useQuery({
        queryKey: ClassListService.queryKeys.list(),
        queryFn: ClassListService.list,
        enabled: !!ClassListService.queryKeys.list && !!ClassListService.list
    });

    const createClass = useMutation({
        mutationFn: ClassListService.create,
        onSuccess: () => {
            toast.success('Thêm thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassListService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Thêm thất bại!');
        }
    });

    const updateClasses = useMutation({
        mutationFn: ClassListService.update,
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassListService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Cập nhật thất bại!');
        }
    });

    const deleteClasses = useMutation({
        mutationFn: ClassListService.update,
        onSuccess: () => {
            toast.success('Ẩn thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassListService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Ẩn thất bại!');
        }
    });

    const showClasses = useMutation({
        mutationFn: ClassListService.update,
        onSuccess: () => {
            toast.success('Hiện thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassListService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Hiện thất bại!');
        }
    });

    const classIdActiveList = useMemo(() => classList?.filter(data => data.isActive).map(data => data.id), [classList])

    return { createClass, updateClasses, deleteClasses, classList, isLoading, showClasses, classIdActiveList }
};

export default useClassList;