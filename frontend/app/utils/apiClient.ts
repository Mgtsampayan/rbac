import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Custom error type for API errors
export interface ApiError {
    status?: number;
    message?: string;
    data?: any;
}

apiClient.interceptors.request.use(
    (config) => {
        console.log('Request Interceptor:', config);
        return config;
    },
    (error: AxiosError) => {
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('Response Interceptor:', response);
        return response;
    },
    async (error: AxiosError) => {
        console.error('Response Error Interceptor:', error);
        if (error.response?.status === 401) {
            console.warn('Unauthorized access detected.');
            // Instead of direct redirect, throw a specific error
            return Promise.reject({
                status: 401,
                message: 'Unauthorized',
            } as ApiError);
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    register: async (userData: RegisterData): Promise<{ user: User }> => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            const apiError: ApiError = {
                status: error.response?.status,
                message: error.response?.data?.message || 'Registration failed',
                data: error.response?.data,
            };
            console.error('Registration API Error:', apiError);
            throw apiError;
        }
    },

    login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            const apiError: ApiError = {
                status: error.response?.status,
                message: error.response?.data?.message || 'Login failed',
                data: error.response?.data,
            };
            console.error('Login API Error:', apiError);
            throw apiError;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error: any) {
            const apiError: ApiError = {
                status: error.response?.status,
                message: error.response?.data?.message || 'Logout failed',
                data: error.response?.data,
            };
            console.error('Logout API Error:', apiError);
            throw apiError;
        }
    },

    updateProfile: async (userData: UpdateProfileData): Promise<User> => {
        try {
            const response = await apiClient.put('/auth/profile', userData);
            return response.data;
        } catch (error: any) {
            const apiError: ApiError = {
                status: error.response?.status,
                message: error.response?.data?.message || 'Profile update failed',
                data: error.response?.data,
            };
            console.error('UpdateProfile API Error:', apiError);
            throw apiError;
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