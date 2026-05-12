import * as Yup from 'yup';
import type { User } from '../../../../../types';
import { Formik, useFormik } from 'formik';
import { useController } from '../../core/requests';
import Button from '../../../../../components/common/Button';
import Input from '../../../../../components/common/Input';

interface Props {
    onSuccess: ()=>void;
    data?:User|null;
    id?:string;
}

const Schema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const CreateTenantForm = ({onSuccess,data,id}:Props) => {

    const controller = useController();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues:{
            name:data?.name,
            email:data?.email
        },
        validationSchema:Schema,
        onSubmit: async(values, { setSubmitting, setStatus }) => {
            try {
                if(data && id){
                    await controller.updateUser(id,values);
                }else{
                    await controller.createUser(values);
                }
                onSuccess();   
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
        <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Name */}
            <Input
                type="text"
                name="name"
                label="Name"
                placeholder="e.g John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.touched.name}
            />

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

            {/* Submit */}
            <Button 
                type="submit"
                loading={formik.isSubmitting}
                loadingText="Signing in..."
                className="w-full"
            >
            Save Details
            </Button>
        </form>
    );
}

export default CreateTenantForm;