
import axios from "axios";
import { API_KEY } from './constant/Apikey';

const axiosYoLoOptions = {
    baseURL: 'http://192.168.101.4:8080/',
    headers: {
        "content-type": "multipart/form-data",
    }
};

const axiosOptions = {
    baseURL: 'http://192.168.101.4:8080/',
    headers: {
        'Content-Type': 'application/json'
    }
};

const axiosFirebaseOptions = {
    baseURL: 'https://identitytoolkit.googleapis.com/v1/',
    headers: {
        'Content-Type': 'application/json'
    }
};

export const axiosDetect = axios.create(axiosYoLoOptions);
export const axiosClient = axios.create(axiosOptions);
export const axiosFirebase = axios.create(axiosFirebaseOptions);

axiosClient.interceptors.response.use(
    response => response.data,
    async error => {
        return Promise.reject(error.response?.data || error);
    }
);

axiosDetect.interceptors.response.use(
    response => response.data,
    async error => {
        return Promise.reject(error.response?.data || error);
    }
);


axiosFirebase.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.data.error.message === 'INVALID_ID_TOKEN') {
            const data = {
                grant_type: 'refresh_token',
                refresh_token: localStorage.getItem('refresh_token')
            }
            const res = await axiosFirebase.post(`token?key=${API_KEY}`, data)
            localStorage.setItem("token", res.data.idToken);
            localStorage.setItem("refresh_token", res.data.refresh_token);
        }

        return await Promise.reject(error.response?.data || error);
    }
);