import axiosInstance from '../axiosInstance';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    },
    logout: async () => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    },
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/auth/me');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    }
};
