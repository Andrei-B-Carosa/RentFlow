import * as Yup from 'yup';

const RegisterFV = {
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8,'Minimum of 8 characters').required('Password is required'),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'),'Passwords do not match']).required('Password confirmation required'),
    
};

const Register = () => {
    
    return (
        <div className="">
            Register
        </div>
    )
}


export default Register;