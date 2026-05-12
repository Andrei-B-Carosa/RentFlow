import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiClient, apiMultipart } from '../../../../../api/axios';
import { ROUTES } from '../../../../../constants/routes';
import swal from '../../../../../utils/swal';
import Input from '../../../../../components/common/Input';
import Button from '../../../../../components/common/Button';
import type { UnitProps } from '../../../units/core/type';

interface Props {
    property_id: string;
    onSuccess: ()=>void
}

const Schema = Yup.object({
    unit_number : Yup.string().required('Unit number is required'),
    rent_price : Yup.number().required('Rent price is required').min(0),
    bedrooms : Yup.number().nullable().min(0),  
    bathrooms : Yup.number().nullable().min(0),
    floor_area : Yup.number().nullable().min(0),
});
const CreateUnitForm = ({ property_id, onSuccess}:Props) => {

    const formik = useFormik({
        initialValues:{
            unit_number :'',
            rent_price : 0,
            bedrooms : '',
            bathrooms : '',
            floor_area : '',
        },
        validationSchema:Schema,
        onSubmit: async(values,{setSubmitting, setStatus})=>{
            try {   
                swal.loading('Creating unit...')
                const res = await apiClient.post(ROUTES.LANDLORD.PROPERTY_UNITS.replace(':id',property_id),values);
                swal.close()
                swal.ok(res.data.message || 'Unit created successfully!')
                onSuccess()
            } catch (error: any) {
                swal.close()
                const message = error.response?.data?.message;
                console.error(error.response?.data?.error);
                setStatus(message || 'Something went wrong.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input 
                label="Unit Number"
                placeholder="e.g. Unit 1A"
                type="text"
                name="unit_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.unit_number}
                touched={formik.touched.unit_number}
            />
            <Input 
                label="Rent Price"
                placeholder="e.g. 10000"
                type="text"
                name="rent_price"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.rent_price}
                touched={formik.touched.rent_price}
            />
             <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Bedrooms"
                    placeholder="e.g. 2"
                    type="number"
                    name="bedrooms"
                    value={formik.values.bedrooms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.bedrooms}
                    touched={formik.touched.bedrooms}
                />
                <Input
                    label="Bathrooms"
                    placeholder="e.g. 1"
                    type="number"
                    name="bathrooms"
                    value={formik.values.bathrooms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.bathrooms}
                    touched={formik.touched.bathrooms}
                />
            </div>

            {/* Floor Area */}
            <Input
                label="Floor Area (sqm)"
                placeholder="e.g. 45.5"
                type="number"
                name="floor_area"
                value={formik.values.floor_area}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.floor_area}
                touched={formik.touched.floor_area}
            />

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Button
                    type="submit"
                    loading={formik.isSubmitting}
                    loadingText="Creating..."
                    className="px-6"
                >
                    Create Unit
                </Button>
            </div>
        </form>
    );
}

export default CreateUnitForm;