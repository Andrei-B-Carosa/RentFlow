import * as Yup from 'yup';
import { useFormik } from 'formik';
import { apiMultipart } from '../../../../../api/axios';
import { ROUTES } from '../../../../../constants/routes';
import swal from '../../../../../utils/swal';
import Input from '../../../../../components/common/Input';
import Button from '../../../../../components/common/Button';
import ImageCropper from '../../../../../components/common/cropper/ImageCropper';
import { useModal } from '../../../../../components/common/modal/ModalProvider';
import TextArea from '../../../../../components/common/TextArea';
import { useEffect, useState } from 'react';
import type { PropertyProps } from '../../core/types';
import { useController } from '../../core/requests';

interface Props {
    onSuccess: ()=>void;
    data?:PropertyProps|null;
}

type PhotoItem =
    | { type: 'existing'; path: string; markedForRemoval: boolean }
    | { type: 'new';      file: File }

const Schema = Yup.object({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    description: Yup.string(),
    photos: Yup.array().nullable(),
    is_active: Yup.boolean(),
});

const CreatePropertyForm = ({onSuccess,data=null}:Props) => {

    const { showModal, closeModal } = useModal()

    const controller = useController();
    const [photos, setPhotos] = useState<PhotoItem[]>([])
    const [url,setUrl] = useState<string>(ROUTES.LANDLORD.PROPERTIES);
    
    useEffect(() => {
        if(!data) return;
        setPhotos(
            data.photos.map((path) => ({
                type:             'existing',
                path,
                markedForRemoval: false,
            }))
        )
        setUrl(ROUTES.LANDLORD.PROPERTY_DETAIL.replace(':id',data.id));
    }, [data])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues:{
            name:data?.name ?? '',
            address:data?.address ?? '',
            city:data?.city ?? '',
            description:data?.description ?? '',
            photos:[] as File[],
            is_active:data?.is_active ?? true,
            remove_photos: [] as string[],
        },
        validationSchema:Schema,
        onSubmit: async(values, { setSubmitting, setStatus }) => {
            try {   
                swal.loading('Creating property...')
                // extract remove_photos paths
                const remove_photos = photos
                    .filter(p => p.type === 'existing' && p.markedForRemoval)
                    .map(p => p.type === 'existing' ? p.path : '')

                // extract new files
                const newFiles = photos
                    .filter(p => p.type === 'new')
                    .map(p => p.type === 'new' ? p.file : null)
                    .filter(Boolean) as File[]

                const payload = {
                    ...values,
                    remove_photos,
                    photos: newFiles,
                    _method: 'PUT'
                }
                const res = await apiMultipart.post(url,payload);
                swal.close()
                swal.ok(res.data.message || 'Property created successfully!')
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

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader  = new FileReader()
        reader.onload = () => {
            // open cropper in modal
            showModal({
                title: 'Crop Photo',
                size:  'lg',
                body: (
                    <ImageCropper
                        imageSrc={reader.result as string}
                        fileName={file.name}
                        aspectRatio={4 / 3}
                        onCropDone={(croppedFile) => {
                            setPhotos(prev => [...prev, { type: 'new', file: croppedFile }])
                            closeModal()
                        }}
                        onCancel={closeModal}
                    />
                ),
            })
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    // existing photo — toggle markedForRemoval
    const toggleRemoveExisting = (index: number) => {
        setPhotos(prev => prev.map((photo, i) =>
            i === index && photo.type === 'existing'
                ? { ...photo, markedForRemoval: !photo.markedForRemoval }
                : photo
        ))
    }

    // new photo — remove entirely
    const removeNewPhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">

            {/* Name */}
            <Input
                label="Property Name"
                name="name"
                type="text"
                placeholder="e.g. Sunset Apartments"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.touched.name}
            />

            {/* Address */}
            <Input
                label="Address"
                name="address"
                type="text"
                placeholder="e.g. 123 Main Street"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.address}
                touched={formik.touched.address}
            />

            {/* City */}
            <Input
                label="City"
                name="city"
                type="text"
                placeholder="e.g. Manila"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.city}
                touched={formik.touched.city}
            />

            {/* Description */}
            <TextArea
                name='description'
                value={formik.values.description}
                placeholder="Brief description of the property..."
                rows={4}
                onChange={formik.handleChange}
                onBlur ={formik.handleBlur}
                label="Description"
            />

            {/* Status */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="is_active"
                            value="true"
                            checked={formik.values.is_active === true}
                            onChange={() => formik.setFieldValue('is_active', true)}
                            className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="is_active"
                            value="false"
                            checked={formik.values.is_active === false}
                            onChange={() => formik.setFieldValue('is_active', false)}
                            className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">Inactive</span>
                    </label>
                </div>
            </div>

            {/* Photo selection*/}
            <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos
                    <span className="text-gray-400 font-normal"> (optional)</span>
                </label>

                <label className="flex flex-col items-center justify-center w-full h-24
                    border-2 border-dashed border-gray-200 rounded-lg cursor-pointer
                    hover:border-blue-400 hover:bg-blue-50 transition">
                    <p className="text-sm text-gray-400">Click to upload a photo</p>
                    <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 2MB</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                    />
                </label>

                {formik.values.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formik.values.photos.map((file, index) => (
                            <div key={index} className="relative w-20 h-20">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = formik.values.photos.filter((_, i) => i !== index)
                                        formik.setFieldValue('photos', updated)
                                    }}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5
                                        bg-red-500 text-white rounded-full text-xs
                                        flex items-center justify-center hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )} */}
                {/* Upload area */}
                <label className="flex flex-col items-center justify-center w-full h-24
                    border-2 border-dashed border-gray-200 rounded-lg cursor-pointer
                    hover:border-blue-400 hover:bg-blue-50 transition">
                    <p className="text-sm text-gray-400">Click to upload a photo</p>
                    <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 2MB</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                    />
                </label>

                {/* Unified photo row */}
                {photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {photos.map((photo, index) => (
                            <div key={index} className={`relative w-20 h-20 transition-opacity
                                ${photo.type === 'existing' && photo.markedForRemoval ? 'opacity-40' : 'opacity-100'}`}>

                                {/* Thumbnail */}
                                <img
                                    src={photo.type === 'existing'
                                        ? `${import.meta.env.VITE_STORAGE_URL}/${photo.path}`
                                        : URL.createObjectURL(photo.file)
                                    }
                                    alt="photo"
                                    className="w-full h-full object-cover rounded-lg"
                                />

                                {/* Existing photo — X to mark removal, Undo if marked */}
                                {photo.type === 'existing' && (
                                    <button
                                        type="button"
                                        onClick={() => toggleRemoveExisting(index)}
                                        className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                            text-white text-xs flex items-center justify-center
                                            ${photo.markedForRemoval
                                                ? 'bg-gray-400 hover:bg-gray-500'
                                                : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                    >
                                        {photo.markedForRemoval ? '↩' : '✕'}
                                    </button>
                                )}

                                {/* New photo — X to remove entirely */}
                                {photo.type === 'new' && (
                                    <button
                                        type="button"
                                        onClick={() => removeNewPhoto(index)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500
                                            hover:bg-red-600 text-white rounded-full text-xs
                                            flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Badge to distinguish existing vs new */}
                                {photo.type === 'new' && (
                                    <span className="absolute bottom-0 left-0 right-0 text-center
                                        text-[9px] bg-blue-600 text-white rounded-b-lg py-0.5">
                                        new
                                    </span>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Button
                    type="submit"
                    loading={formik.isSubmitting}
                    loadingText="Creating..."
                    className="px-6"
                >
                    Create Property
                </Button>
            </div>

        </form>
    );
}

export default CreatePropertyForm;