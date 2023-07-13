import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AttendanceService } from '../../services/AttendanceService';
import { toast } from 'react-toastify';
import useAuth from './useAuth';
import { useMemo } from 'react';

const useAttendance = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useAuth()

    const { data: attendanceListBase, isLoading } = useQuery({
        queryKey: AttendanceService.queryKeys.list(),
        queryFn: AttendanceService.list,
        enabled: !!AttendanceService.queryKeys.list && !!AttendanceService.list
    });

    const createAttendance = useMutation({
        mutationFn: AttendanceService.create,
        onSuccess: () => {
            toast.success('Lưu thành công!');
            queryClient.invalidateQueries({
                queryKey: AttendanceService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Lưu thất bại!');
        }
    });

    const updateAttendance = useMutation({
        mutationFn: AttendanceService.update,
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({
                queryKey: AttendanceService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Cập nhật thất bại!');
        }
    });

    const deleteAttendance = useMutation({
        mutationFn: AttendanceService.delete,
        onSuccess: () => {
            toast.success('Xóa thành công!');
            queryClient.invalidateQueries({
                queryKey: AttendanceService.queryKeys.list()
            });
        },
        onError: () => {
            toast.error('Xóa thất bại!');
        }
    });

    const attendanceList = useMemo(() => attendanceListBase?.filter(data => data.lecturerId === currentUser?.localId) || [], [attendanceListBase, currentUser?.localId])
    return {
        isLoading,
        attendanceList,
        createAttendance,
        updateAttendance,
        deleteAttendance,
    }
};

export default useAttendance;