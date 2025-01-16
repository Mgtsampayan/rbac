import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        console.log('Request Interceptor:', config);
        return config;
    },
    (error) => {
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('Response Interceptor:', response);
        return response;
    },
    async (error) => {
        console.error('Response Error Interceptor:', error);
        if (error.response?.status === 401) {
            // Consider notifying the user instead of a direct redirect
            console.warn('Unauthorized access, redirecting to login');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    register: async (userData: RegisterData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            console.error('Registration API Error:', error);
            throw error; // Re-throw to be caught by the component
        }
    },

    login: async (credentials: LoginCredentials) => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            console.error('Login API Error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        } catch (error: any) {
            console.error('Logout API Error:', error);
            throw error;
        }
    },

    // getCurrentUser: async () => {
    //     try {
    //         const response = await apiClient.get('/auth/me'); // Changed to /auth/me to match backend
    //         return response.data;
    //     } catch (error: any) {
    //         console.error('GetCurrentUser API Error:', error);
    //         throw error;
    //     }
    // },

    updateProfile: async (userData: UpdateProfileData) => {
        try {
            const response = await apiClient.put('/auth/profile', userData);
            return response.data;
        } catch (error: any) {
            console.error('UpdateProfile API Error:', error);
            throw error;
        }
    }
};

// Types (No changes needed here, they look good)
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UpdateProfileData {
    username?: string;
    email?: string;
    [key: string]: any;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    profileComplete: boolean;
}

export default apiClient;