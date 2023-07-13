import { axiosClient, axiosFirebase } from '../axiosBase'
import { API_KEY } from '../constant/Apikey';

const queryKeys = {
    all: ['class'],
    list: () => [...queryKeys.all, 'list']
};



const AuthService = {
    login: (data) => axiosClient.post('login', data),
    update: ({ id, data }) => axiosClient.put(`class/update/${id}`, data),
    delete: (id) => axiosClient.delete(`class/delete/${id}`),

    resetPassword: (data) => axiosFirebase.post(`accounts:sendOobCode?key=${API_KEY}`, data),
    changePassword: (data) => axiosFirebase.post(`accounts:update?key=${API_KEY}`, data),
    getCurrentUser: (data) => axiosFirebase.post(`accounts:lookup?key=${API_KEY}`, data),
};

export default AuthService