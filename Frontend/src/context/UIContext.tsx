import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import AlertToast from "../components/shared/AlertToast";

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
    show: boolean;
    message: string;
    type: AlertType;
}

interface UIContextType {
    sidebarOpen: boolean;
    theme: string;
    toggleSidebar: () => void;
    toggleTheme: () => void;
    showAlert: (message: string, type?: AlertType) => void;
    hideAlert: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [theme, setTheme] = useState<string>('light');
    const [alert, setAlert] = useState<Alert>({
        show: false,
        message: '',
        type: 'info'
    });
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const toggleSidebar = (): void => setSidebarOpen(prev => !prev);
    const toggleTheme = (): void => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const showAlert = useCallback((message: string, type: AlertType = 'info'): void => {
        // Clear any existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setAlert({ show: true, message, type });

        // Auto-hide after 3 seconds
        timerRef.current = setTimeout(() => {
            setAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    }, []);

    const hideAlert = useCallback((): void => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setAlert(prev => ({ ...prev, show: false }));
    }, []);

    return (
        <UIContext.Provider value={{
            sidebarOpen,
            theme,
            toggleSidebar,
            toggleTheme,
            showAlert,
            hideAlert
        }}>
            {children}
            {alert.show && (
                <AlertToast
                    message={alert.message}
                    type={alert.type}
                    onClose={hideAlert}
                />
            )}
        </UIContext.Provider>
    );
};

export const useUIContext = (): UIContextType => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUIContext must be used within a UIProvider');
    }
    return context;
};