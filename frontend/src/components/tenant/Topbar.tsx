import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import Button from '../common/Button';
// import apiClient from '../../api/axios';

const NAV_LINKS = [
    { label: 'Unit',             to: ROUTES.TENANT.UNIT },
    { label: 'Payment History',    to: ROUTES.TENANT.PAYMENTS },
    { label: 'Maintenance Request', to: ROUTES.TENANT.MAINTENANCE },
];

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const location         = useLocation();

    const handleLogout = async () => {
        try {
            // optional: call Laravel logout endpoint to revoke token
            // await apiClient.post('/auth/logout');
            // apiClient.get()
        } finally {
            logout();
            navigate(ROUTES.LOGIN);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">

            {/* Left — page title */}
            <div>
                <h2 className="text-lg font-bold text-gray-800">
                    Rentflow
                </h2>
            </div>

            {/* Center — nav links */}
            <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ label, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={[
                            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150',
                            location.pathname === to
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        ].join(' ')}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Right — user info + logout */}
            <div className="flex items-center gap-4">

                {/* User avatar + name */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                </div>

                {/* Logout */}
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-sm"
                >
                    Logout
                </Button>

            </div>
        </header>
    );
};

export default Topbar;