import axiosInstance from '../axiosInstance';

export const userService = {
    updateProfile: async (userData) => {
        const response = await axiosInstance.put('/user/profile', userData);
        return response.data;
    },
    changePassword: async (passwords) => {
        const response = await axiosInstance.put('/user/password', passwords);
        return response.data;
    },
    getAgents: async () => {
        const response = await axiosInstance.get('/users/agents');
        return response.data;
    }
};
