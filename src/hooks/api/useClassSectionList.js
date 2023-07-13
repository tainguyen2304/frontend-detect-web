import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClassSectionLIstService } from '../../services/ClassSectionLIstService';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import useAuth from './useAuth';
import useClassList from './useClassList';
import useSubjectList from './useSubjectList';

const useClassSectionList = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useAuth()
    const { classIdActiveList } = useClassList()
    const { subjectIdActiveList } = useSubjectList()

    const { data: classSectionListBase, isLoading } = useQuery({
        queryKey: ClassSectionLIstService.queryKeys.list(),
        queryFn: ClassSectionLIstService.list,
        enabled: !!ClassSectionLIstService.queryKeys.list && !!ClassSectionLIstService.list
    });

    const createClassSectionList = useMutation({
        mutationFn: ClassSectionLIstService.create,
        onSuccess: () => {
            toast.success('Thêm thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassSectionLIstService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Thêm thất bại!');
        }
    });

    const updateClassSection = useMutation({
        mutationFn: ClassSectionLIstService.update,
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassSectionLIstService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Cập nhật thất bại!');
        }
    });

    const deleteClassSection = useMutation({
        mutationFn: ClassSectionLIstService.delete,
        onSuccess: () => {
            toast.success('Xóa thành công!');
            queryClient.invalidateQueries({
                queryKey: ClassSectionLIstService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Xóa thất bại!');
        }
    });

    const classSectionList = useMemo(() => classSectionListBase?.filter(data =>
        data.lecturerId === currentUser?.localId
        && classIdActiveList.includes(data.classNameId)
        && subjectIdActiveList.includes(data.subjectId)
    ), [classIdActiveList, classSectionListBase, currentUser?.localId, subjectIdActiveList])

    return {
        createClassSectionList, classSectionList, updateClassSection,
        deleteClassSection, isLoading
    }
};

export default useClassSectionList;