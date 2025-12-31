import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AlertToast from '../shared/AlertToast';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <AlertToast />
        </div>
    );
};

export default MainLayout;
