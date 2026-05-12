import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

type NavItem = {
    label: string;
    path:  string;
    icon:  string;
};

const navItems: NavItem[] = [
    { label: 'Dashboard',   path: ROUTES.LANDLORD.DASHBOARD,   icon: '📊' },
    { label: 'Properties',  path: ROUTES.LANDLORD.PROPERTIES,  icon: '🏢' },
    { label: 'Leases',      path: ROUTES.LANDLORD.LEASES,      icon: '📄' },
    { label: 'Payments',    path: ROUTES.LANDLORD.PAYMENTS,    icon: '💰' },
    { label: 'Maintenance', path: ROUTES.LANDLORD.MAINTENANCE, icon: '🔧' },
    { label: 'Tenants',     path: ROUTES.LANDLORD.TENANTS,     icon: '👥' },
];

const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-gray-900 flex flex-col flex-shrink-0">

            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-700">
                <span className="text-white text-xl font-bold tracking-tight">
                    🏢 RentFlow
                </span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                            ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom — app version */}
            <div className="px-6 py-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">RentFlow v1.0.0</p>
            </div>

        </aside>
    );
};

export default Sidebar;