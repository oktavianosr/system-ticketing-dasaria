import { createContext, useContext, useState, useCallback, useRef } from 'react';
import AlertToast from "../components/shared/AlertToast";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState('light');
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'info'
    });
    const timerRef = useRef(null);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const showAlert = useCallback((message, type = 'info') => {
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

    const hideAlert = useCallback(() => {
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

export const useUIContext = () => useContext(UIContext);