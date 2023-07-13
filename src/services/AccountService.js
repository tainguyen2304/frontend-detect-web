import { axiosClient } from '../axiosBase'

const queryKeys = {
    all: ['account'],
    list: () => [...queryKeys.all, 'list']
};



const AccountService = {
    queryKeys,
    list: () => axiosClient.get('account/list'),
    create: (data) => axiosClient.post('account/add', data),
    update: ({ id, data }) => axiosClient.put(`account/update/${id}`, data),
    delete: (data) => axiosClient.post(`account/delete`, data),
};

export default AccountService