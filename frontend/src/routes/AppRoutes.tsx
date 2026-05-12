import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/Login';
import { ROUTES } from '../constants/routes';
import Dashboard from '../pages/landlord/dashboard';
import LandlordLayout from '../layouts/LandlordLayout';
import PropertiesPage from '../pages/landlord/properties/PropertiesPage';
import PropertyDetailPage from '../pages/landlord/properties/PropertyDetailPage';
import TenantPage from '../pages/landlord/tenants/TenantPage';
import TenantDetailPage from '../pages/landlord/tenants/TenantDetailPage';
import LeasesPage from '../pages/landlord/leases/LeasesPage';
import MaintenancePage from '../pages/landlord/maintenance/MaintenancePage';

interface ProtectedRouteProps {
    role?: 'LANDLORD' | 'TENANT';
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
    const { user } = useAuth();
    if (!user) return <Navigate to={ROUTES.LOGIN} />;
    if (role && user.role !== role) return <Navigate to={ROUTES.LOGIN} />;
    return <Outlet />;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                <Route element={<ProtectedRoute role="LANDLORD" />}>
                    <Route element={<LandlordLayout />}>
                        <Route path={ROUTES.LANDLORD.DASHBOARD}   element={<Dashboard />} />
                        <Route path={ROUTES.LANDLORD.PROPERTIES}  element={<PropertiesPage />} />
                        <Route path={ROUTES.LANDLORD.PROPERTY_DETAIL}  element={<PropertyDetailPage />} />
                        <Route path={ROUTES.LANDLORD.TENANTS}     element={<TenantPage/>} />
                        <Route path={ROUTES.LANDLORD.TENANT_DETAIL}     element={<TenantDetailPage/>} />
                        <Route path={ROUTES.LANDLORD.LEASES}      element={<LeasesPage/>} />
                        <Route path={ROUTES.LANDLORD.PAYMENTS}    element={<div>Payments</div>} />
                        <Route path={ROUTES.LANDLORD.MAINTENANCE} element={<MaintenancePage/>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;