import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState('light');

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <UIContext.Provider value={{ sidebarOpen, theme, toggleSidebar, toggleTheme }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUIContext = () => useContext(UIContext);
