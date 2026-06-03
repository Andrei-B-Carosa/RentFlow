import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Button from '../../../../../components/common/Button';
import { useController } from '../../core/requests';
import type { Maintenance } from '../../core/types';
import Input from '../../../../../components/common/Input';
import TextArea from '../../../../../components/common/TextArea';
import { useState } from 'react';

type Props = {
    data? : Maintenance;
    onSuccess?: () => void;
    id ? :string;
}

const Schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    photos: Yup.array().optional(),
    priority: Yup.string().required('Priority is required'),
})

const CreateMaintenanceRequestForm = ({data, onSuccess, id}: Props) => {
    const controller = useController();
    const isEdit     = !!data && !!id
    const [photo, setPhoto] = useState<File[]>([]);
    // const handlePhotoSelect = ()=>{

    // }

    return(
        <Formik
            initialValues={{
                title: data?.title,
                description: data?.description,
                photos: [] as File[],
                priority: data?.priority || 'LOW',
            }}
            validationSchema={Schema}
            onSubmit={async (values,{ setSubmitting }) => {
                try{
                    if(isEdit){
                        await controller.updateMaintenanceRequest(id, values);
                    }else{
                        await controller.createMaintenanceRequest(values);
                    }
                    onSuccess()

                } catch (error:any) {
                    setSubmitting(false)
                }
            }}
        >   
        {({ handleSubmit, errors, touched, handleBlur, handleChange, values, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        label="Title"
                        name="title"
                        type="text"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.title}
                        touched={touched.title}
                    />
                    <div className="space-y-2">
                        <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
                        <select
                            value={values.priority}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="priority"
                            name="priority"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                        {touched.priority && errors.priority && (
                            <p className="text-red-500 text-sm">{errors.priority}</p>
                        )}
                    </div>
                    <TextArea
                        label="Description"
                        name="description"
                        placeholder="Put your description . . ."
                        rows={4}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.description}
                        touched={touched.description}
                    />
                    <div>
                        <label className="text-sm font-medium text-gray-700">Photos</label>
                        <label className="flex flex-col items-center justify-center w-full h-24
                            border-2 border-dashed border-gray-200 rounded-lg cursor-pointer
                            hover:border-blue-400 hover:bg-blue-50 transition">
                            <p className="text-sm text-gray-400">Click to upload a photo</p>
                            <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 2MB</p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(event) => {
                                    const files = Array.from(
                                        event.currentTarget.files || []
                                    );

                                    setFieldValue("photos", files);
                                    setPhoto(files)
                                    event.currentTarget.value = "";
                                }}
                            />
                        </label>
                    </div>
                    {photo.map((file, index) => (
                        <div key={index} className="relative w-20 h-20">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="photo"
                                className="w-full h-full object-cover rounded-lg"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    const updatedPhotos = photo.filter((_, i) => i !== index);
                                    setPhoto(updatedPhotos);
                                    setFieldValue("photos", updatedPhotos);
                                }}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500
                                    hover:bg-red-600 text-white rounded-full text-xs
                                    flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Submit
                    </Button>
                </div>
            </Form>
        )}
    </Formik>
    )
    
}
export default CreateMaintenanceRequestForm;