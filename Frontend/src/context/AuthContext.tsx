import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/index';

interface User {
    id?: string | number;
    name: string;
    email: string;
    [key: string]: any;
}

interface LoginResponse {
    data: {
        token: string;
        user: User;
    };
    message: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await authService.getProfile();
                    setUser(userData.data);
                }
            } catch (error) {
                console.error('Auth check failed', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<LoginResponse> => {
        const data = await authService.login(email, password);
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        return data;
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
