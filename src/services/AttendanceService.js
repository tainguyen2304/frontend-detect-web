import { axiosClient } from '../axiosBase'

const queryKeys = {
    all: ['attendance'],
    list: () => [...queryKeys.all, 'list']
};



export const AttendanceService = {
    queryKeys,
    list: () => axiosClient.get('attendance/list'),
    create: (data) => axiosClient.post('attendance/add', data),
    update: ({ id, data }) => axiosClient.put(`attendance/update/${id}`, data),
    delete: (id) => axiosClient.delete(`attendance/delete/${id}`),
};