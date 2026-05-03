import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import Button from '../common/Button';
// import apiClient from '../../api/axios';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();

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

            {/* Left — page title placeholder */}
            <div>
                <h2 className="text-sm font-semibold text-gray-800">
                    Welcome back, {user?.name} 👋
                </h2>
                <p className="text-xs text-gray-400">
                    Manage your properties from here
                </p>
            </div>

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