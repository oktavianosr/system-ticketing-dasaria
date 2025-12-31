import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useUIContext } from '../../context/UIContext';

const MainLayout = () => {
    const { sidebarOpen } = useUIContext();
    return (
        <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
export default MainLayout;
