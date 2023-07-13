import { axiosClient } from '../axiosBase'

const queryKeys = {
    all: ['subject'],
    list: () => [...queryKeys.all, 'list']
};



export const SubjectService = {
    queryKeys,
    list: () => axiosClient.get('subject/list'),
    create: (data) => axiosClient.post('subject/add', data),
    update: ({ id, data }) => axiosClient.put(`subject/update/${id}`, data),
    delete: (id) => axiosClient.delete(`subject/delete/${id}`),
};