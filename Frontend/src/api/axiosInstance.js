import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isLoginRequest = error.config.url.includes('/login');

            if (!isLoginRequest) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const customError = {
            message: 'System error occurred',
            errors: null,
            status: error.response?.status
        };

        if (error.response) {
            const data = error.response.data;

            customError.message = data.message || customError.message;
            if (data.errors) {
                customError.errors = data.errors;
                const firstErrorField = Object.keys(data.errors)[0];
                customError.message = data.errors[firstErrorField][0];
            }
        } else if (error.request) {
            customError.message = 'Connection to server lost';
        }

        return Promise.reject(customError);
    }
);

export default axiosInstance;
