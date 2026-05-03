import { Outlet } from 'react-router-dom';
import Sidebar from '../components/landlord/Sidebar';
import Topbar from '../components/landlord/Topbar';

const LandlordLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* Sidebar */}
            <Sidebar />

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

export default LandlordLayout;