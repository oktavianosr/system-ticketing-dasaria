import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="navbar">
            <div className="navbar-brand">Ticket System</div>
            <div className="navbar-menu">
                {user && (
                    <div className="user-menu">
                        <span>{user.name}</span>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
