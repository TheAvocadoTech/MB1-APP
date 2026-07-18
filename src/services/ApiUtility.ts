import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-AsyncStorage';
import AsyncStorage from '@react-native-community/async-storage';
import { store } from '../store/store';

const api = axios.create({
    baseURL: 'https://api.avocadotech.in/',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

const apiFormData = axios.create({
    baseURL: 'https://api.avocadotech.in/',
    timeout: 120000,
});

apiFormData.interceptors.request.use(
    async config => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error),
);

api.interceptors.request.use(
    async config => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error),
);

export const fetchData = async (endpoint: string) => {
    try {
        const response = await api.get(endpoint);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error:", error?.config);
            return error.response;
        } else {
            console.log("Generic Error:", error);
        }
    }
};

export const postData = async (endpoint: string, body: any) => {
    try {
        const response = await api.post(endpoint, body);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error:", error?.config);
            return error.response;
        } else {
            console.log("Generic Error:", error);
        }
    }
};

export const putData = async (endpoint: string, body: any) => {
    try {
        const response = await api.put(endpoint, body);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios PUT Error:", error?.config);
            return error.response;
        } else {
            console.log("Generic PUT Error:", error);
        }
    }
};

export const postFormData = async (endpoint: string, body: FormData) => {
    try {
        const response = await apiFormData.post(endpoint, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
        });
        console.log('Success:___', response.config);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error:", error?.config);
            console.log('Error response:', error.response?.data);
            console.log('Status:', error.response?.status);
            console.log('Headers:', error.response?.headers);
            return error.response;
        } else {
            console.log("Generic Error:", error);
        }
    }
};

export const deleteData = async (endpoint: string) => {
    try {
        const response = await api.delete(endpoint);
        console.log('Delete Success:___', response.config);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Delete Axios Error:", error?.config);
            console.log('Error response:', error.response?.data);
            console.log('Status:', error.response?.status);
            console.log('Headers:', error.response?.headers);
            return error.response;
        } else {
            console.log("Delete Generic Error:", error);
        }
    }
};

export const scanQRToken = async (token: string) => {
    try {
        const response = await api.post('/api/IDVisitor/visitors/scan', { token });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const regenerateQR = async (visitorId: string) => {
    try {
        const response = await api.post(`/api/IDVisitor/visitors/${visitorId}/regenerate-qr`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const fetchVisitorDashboard = async (token: string) => {
    try {
        const response = await api.get('/api/IDVisitor/visitors/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export default api;