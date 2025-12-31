import axiosInstance from '../axiosInstance';

export const authService = {
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        console.log(response.data);
        return response.data.data;
    },
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data.data;
    },
    getProfile: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data.data;
    }
};
