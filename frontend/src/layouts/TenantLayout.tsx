import { Outlet } from 'react-router-dom';
import Topbar from '../components/tenant/Topbar';

const TenantLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Topbar */}
                <Topbar />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default TenantLayout;