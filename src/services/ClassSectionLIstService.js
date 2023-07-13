import { axiosClient } from '../axiosBase'

const queryKeys = {
    all: ['class-section'],
    list: () => [...queryKeys.all, 'list']
};



export const ClassSectionLIstService = {
    queryKeys,
    list: () => axiosClient.get('classSection/list'),
    create: (data) => axiosClient.post('classSection/add', data),
    update: ({ id, data }) => axiosClient.put(`classSection/update/${id}`, data),
    delete: (id) => axiosClient.delete(`classSection/delete/${id}`),
};