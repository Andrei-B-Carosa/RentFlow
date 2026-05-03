import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ROUTES } from '../../constants/routes';

const LoginSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            email: '',
            password: '',
        },
        validationSchema:LoginSchema,
        onSubmit: async(values, { setSubmitting, setStatus }) => {
            try {
                const response = await apiClient.post('/auth/login', values);
                const { user, token } = response.data;

                login(user, token);

                // redirect based on role
                if (user.role === 'LANDLORD') navigate(ROUTES.LANDLORD.DASHBOARD);
                if (user.role === 'TENANT')   navigate(ROUTES.TENANT.DASHBOARD);
                
            } catch (error: any) {
                const message = error.response?.data?.message;
                console.error(error.response?.data?.error);
                setStatus(message || 'Something went wrong.');
            } finally {
                setSubmitting(false);
            }
        }
    });
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">RentFlow</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                {/* Global error */}
                {formik.status && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{formik.status}</p>
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    {/* Email */}
                    <Input
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.email}
                        touched={formik.touched.email}
                    />

                    {/* Password */}
                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.password}
                        touched={formik.touched.password}
                    />

                    {/* Submit */}
                    <Button 
                        type="submit"
                        loading={formik.isSubmitting}
                        loadingText="Signing in..."
                        className="w-full"
                    >
                    Sign In
                    </Button>
                </form>
            </div>
        </div>
    )
}


export default LoginPage;