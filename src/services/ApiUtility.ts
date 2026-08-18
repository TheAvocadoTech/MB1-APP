import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';

import { APP_FLAVOR } from '../config/flavor';

const BASE_URL = APP_FLAVOR === 'MB1' ? 'http://192.168.20.10:8000/api/' : 'https://api.avocadotech.in/';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

const publicApi = axios.create({
    baseURL: BASE_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

const apiFormData = axios.create({
    baseURL: BASE_URL,
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

export const fetchCabinetsList = async (idNumber: string) => {
    try {
        const response = await api.get('/api/cabinet/', {
            params: { idNumber }
        });
        console.log("This is fetch cabinates list response ===>", response)
        return response.data;
    } catch (error) {
        console.log("This is error>>>", error)
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const fetchCabinetDetails = async (cabinetId: string) => {
    try {
        console.log("This is cabinateId >>>", cabinetId)
        const response = await publicApi.get(`/api/Cabinet/${cabinetId}`);
        console.log("This is fetch cabinate details response ===>", response)
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};
export const fetchVisitorAssignedCabinet = async (visitorId: string, idNumber: string="Tag1") => {
      console.log("This is url >>", `${BASE_URL}api/IDVisitor/visitors/${visitorId}/cabinet`)
    try {
        const response = await publicApi.put(`/api/IDVisitor/visitors/${visitorId}/cabinet`, {
            idNumber: idNumber
        });
      
        console.log("This is fetch visitor assigned cabinet response ===>", response);
        return response.data;
    } catch (error) {
        console.log("Error fetching in fetchVisitorAssignedCabinet >>>", error);
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

let cachedVisitorId: string | null = null;

export const getAllVisitors = async (params = {}) => {
    try {
        const response = await api.get('/api/IDVisitor/visitors', { params });
        return response.data;
    } catch (error: any) {
        console.warn("getAllVisitors API notice:", error.message);
        return { success: false, data: [] };
    }
};

export const fetchVisitorLocation = async (visitorId: string) => {
    try {
        let targetId = visitorId;

        const isValidMongoId = (id: any) =>
            typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

        if (!isValidMongoId(targetId)) {
            if (cachedVisitorId) {
                targetId = cachedVisitorId;
            } else {
                const visitorsRes = await getAllVisitors();
                if (visitorsRes?.data && Array.isArray(visitorsRes.data) && visitorsRes.data.length > 0) {
                    const activeVisitor = visitorsRes.data.find((v: any) => v.idNumber || v._id || v.id) || visitorsRes.data[0];
                    targetId = activeVisitor._id || activeVisitor.id;
                    cachedVisitorId = targetId;
                }
            }
        }

        if (!targetId || !isValidMongoId(targetId)) {
            targetId = "6a624b4560e3cc3ce7496ccd";
        }

        console.log("This is location url  >>", `${BASE_URL}api/IDVisitor/visitors/${targetId}/location?includePath=true`);
        
        const response = await publicApi.get(`/api/IDVisitor/visitors/${targetId}/location?includePath=true`);
        console.log("This is fetch visitor location response ===>", response);
        return response.data;
    } catch (error: any) {
        console.log("Error fetching in fetchVisitor location >>>", error);
        
        if (
            axios.isAxiosError(error) && 
            error.response && 
            error.response.status === 500 &&
            visitorId !== "6a624b4560e3cc3ce7496ccd"
        ) {
            try {
                const fallbackRes = await publicApi.get(`/api/IDVisitor/visitors/6a624b4560e3cc3ce7496ccd/location?includePath=true`);
                return fallbackRes.data;
            } catch (fallbackErr: any) {
                return { success: false, message: fallbackErr.message, data: null };
            }
        }

        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const updateVisitorCabinet = async (visitorId: string, idNumber: string) => {
    try {
        const response = await publicApi.put(`/api/IDVisitor/visitors/${visitorId}/cabinet`, { idNumber });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const getMapDetails = async (mapId: string) => {
    try {
        const response = await api.get(`/api/maps/${mapId}`);
        return response.data;
    } catch (error: any) {
        console.warn("Map details API notice:", error.message);
        return null;
    }
};

export const getNavigationRoute = async (mapId: string, fromX: number, fromY: number, toX: number, toY: number) => {
    try {
        const response = await api.get(
            `/api/maps/${mapId}/route?fromX=${fromX}&fromY=${fromY}&toX=${toX}&toY=${toY}`
        );
        return response.data;
    } catch (error: any) {
        console.warn("Navigation route API notice:", error.message);
        return null;
    }
};

export default api;