
import axios from "axios";

const axiosYoLoOptions = {
    baseURL: ' http://10.41.8.127:8080/',
    headers: {
        "content-type": "multipart/form-data",
    }
};

const axiosOptions = {
    baseURL: ' http://10.41.8.127:8080/',
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

