import axios from "axios";

const axiosOptions = {
    baseURL: 'http://192.168.11.31:8080',
    headers: {
        "content-type": "multipart/form-data",
    }
};

const axiosClient = axios.create(axiosOptions);

axiosClient.interceptors.response.use(
    response => response.data,
    async error => {
        return Promise.reject(error.response?.data || error);
    }
);

export default axiosClient

