import { axiosClient } from '../axiosBase'

const queryKeys = {
    all: ['class'],
    list: () => [...queryKeys.all, 'list']
};



export const ClassListService = {
    queryKeys,
    list: () => axiosClient.get('class/list'),
    create: (data) => axiosClient.post('class/add', data),
    update: ({ id, data }) => axiosClient.put(`class/update/${id}`, data),
    delete: (id) => axiosClient.delete(`class/delete/${id}`),
};