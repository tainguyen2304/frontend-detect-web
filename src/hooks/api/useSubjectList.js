import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubjectService } from '../../services/SubjectService';
import { toast } from 'react-toastify';
import { useMemo } from 'react';

const useSubjectList = () => {
    const queryClient = useQueryClient();

    const { data: subjectList, isLoading } = useQuery({
        queryKey: SubjectService.queryKeys.list(),
        queryFn: SubjectService.list,
        enabled: !!SubjectService.queryKeys.list && !!SubjectService.list
    });

    const createSubject = useMutation({
        mutationFn: SubjectService.create,
        onSuccess: () => {
            toast.success('Thêm thành công!');
            queryClient.invalidateQueries({
                queryKey: SubjectService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Thêm thất bại!');
        }
    });

    const updateSubject = useMutation({
        mutationFn: SubjectService.update,
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({
                queryKey: SubjectService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Cập nhật thất bại!');
        }
    });

    const deleteSubject = useMutation({
        mutationFn: SubjectService.update,
        onSuccess: () => {
            toast.success('Ẩn thành công!');
            queryClient.invalidateQueries({
                queryKey: SubjectService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Ẩn thất bại!');
        }
    });

    const showSubject = useMutation({
        mutationFn: SubjectService.update,
        onSuccess: () => {
            toast.success('Hiện thành công!');
            queryClient.invalidateQueries({
                queryKey: SubjectService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Hiện thất bại!');
        }
    });

    const subjectIdActiveList = useMemo(() => subjectList?.filter(data => data.isActive).map(data => data.id), [subjectList])

    return {
        isLoading,
        subjectList,
        deleteSubject,
        updateSubject,
        createSubject,
        showSubject,
        subjectIdActiveList
    }
};

export default useSubjectList;