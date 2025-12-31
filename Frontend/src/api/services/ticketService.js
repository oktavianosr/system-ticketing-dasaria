import axiosInstance from '../axiosInstance';

export const ticketService = {
    getAll: async (params) => {
        const response = await axiosInstance.get('/tickets', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/tickets/${id}`);
        return response.data;
    },
    create: async (ticketData) => {
        const response = await axiosInstance.post('/tickets', ticketData);
        return response.data;
    },
    update: async (id, ticketData) => {
        const response = await axiosInstance.put(`/tickets/${id}`, ticketData);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/tickets/${id}`);
        return response.data;
    },
    addComment: async (ticketId, comment) => {
        const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, { comment });
        return response.data;
    },
    getComments: async (ticketId) => {
        const response = await axiosInstance.get(`/tickets/${ticketId}/comments`);
        return response.data;
    },
    assignTicket: async (ticketId, agentId) => {
        const response = await axiosInstance.post(`/tickets/${ticketId}/assign`, { assigned_to: agentId });
        return response.data;
    }
};
