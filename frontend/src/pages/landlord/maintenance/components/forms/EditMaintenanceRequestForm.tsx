import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useController } from '../../core/requests'
import type { MaintenanceRequestProps } from '../../core/type'
import Button from '../../../../../components/common/Button'
import { handleApiError } from '../../../../../utils/errorHandler'
import swal from '../../../../../utils/swal'

interface Props {
    onSuccess: () => void
    data?:     MaintenanceRequestProps | null
    id?:       string | null
}

const Schema = Yup.object({
    status:         Yup.string().required('Status is required'),
    resolved_at:    Yup.date().nullable(),
    landlord_notes: Yup.string().nullable(),
})

const priorityStyle: Record<string, string> = {
    LOW:    'text-gray-500 bg-gray-50 border-gray-200',
    MEDIUM: 'text-blue-600 bg-blue-50 border-blue-100',
    HIGH:   'text-orange-600 bg-orange-50 border-orange-100',
    URGENT: 'text-red-600 bg-red-50 border-red-100',
}

const statusStyle: Record<string, string> = {
    OPEN:        'text-blue-600 bg-blue-50 border-blue-100',
    IN_PROGRESS: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    RESOLVED:    'text-green-600 bg-green-50 border-green-100',
}

const formatDateForInput = (date: string | null | undefined): string => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

const formatDateDisplay = (date: string | null | undefined): string => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: '2-digit'
    })
}

const EditMaintenanceRequestForm = ({
    onSuccess,
    data = null,
    id   = null,
}: Props) => {

    const controller = useController()
    const isResolved = data?.status === 'RESOLVED'

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            status:         data?.status         ?? '',
            landlord_notes: data?.landlord_notes ?? '',
            resolved_at:    formatDateForInput(data?.resolved_at),
        },
        validationSchema: Schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await controller.updateMaintenance(id!, values)
                onSuccess()
            } catch (error: any) {
                handleApiError(error)
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <div className="space-y-5">

            {isResolved && (
                <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="flex-shrink-0 mt-0.5">✅</span>
                    <div>
                        <p className="text-sm font-semibold text-green-800">
                            This request has been resolved
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                            Resolved on {formatDateDisplay(data?.resolved_at)}
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">

                {/* Title */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Title
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                        {data?.title ?? '—'}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Description
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {data?.description ?? '—'}
                    </p>
                </div>

                {/* Priority + Status side by side */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Priority
                        </p>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider
                            ${priorityStyle[data?.priority ?? ''] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            {data?.priority ?? '—'}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Current Status
                        </p>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider
                            ${statusStyle[data?.status ?? ''] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            {data?.status?.replace('_', ' ') ?? '—'}
                        </span>
                    </div>
                </div>

                {/* Submitted by + date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Submitted By
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center
                                justify-center text-white text-[9px] font-bold flex-shrink-0">
                                {data?.tenant?.name?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                {data?.tenant?.name ?? '—'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Submitted On
                        </p>
                        <p className="text-sm text-gray-600">
                            {data?.formatted_date}
                        </p>
                    </div>
                </div>

                {/* Unit */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Unit
                    </p>
                    <p className="text-sm text-gray-600">
                        {data?.unit?.unit_number ?? '—'}
                        {data?.unit?.property?.name && (
                            <span className="text-gray-400 ml-1.5">
                                — {data.unit.property.name}
                            </span>
                        )}
                    </p>
                </div>

                {/* Photos */}
                {data?.photos && data.photos.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Photos
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.photos.map((photo, index) => (
                                <a
                                    key={index}
                                    href={`${import.meta.env.VITE_STORAGE_URL}/${photo}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${photo}`}
                                        alt={`photo ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200
                                            hover:opacity-80 transition cursor-pointer"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!isResolved && (
                <form onSubmit={formik.handleSubmit} className="space-y-4">

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Update Status
                        </label>
                        <select
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                outline-none transition focus:ring-2 focus:ring-blue-500
                                focus:border-blue-500 bg-white"
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.status}</p>
                        )}
                    </div>

                    {/* Resolved At — only show if status is RESOLVED */}
                    {formik.values.status === 'RESOLVED' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Resolved Date
                            </label>
                            <input
                                type="date"
                                name="resolved_at"
                                value={formik.values.resolved_at}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                    outline-none transition focus:ring-2 focus:ring-blue-500
                                    focus:border-blue-500"
                            />
                            {formik.touched.resolved_at && formik.errors.resolved_at && (
                                <p className="mt-1 text-xs text-red-500">
                                    {String(formik.errors.resolved_at)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Landlord Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landlord Notes
                            <span className="text-gray-400 font-normal"> (optional)</span>
                        </label>
                        <textarea
                            name="landlord_notes"
                            value={formik.values.landlord_notes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Add internal notes about this request..."
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                outline-none transition focus:ring-2 focus:ring-blue-500
                                focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-2 border-t border-gray-100">
                        <Button
                            type="submit"
                            loading={formik.isSubmitting}
                            loadingText="Updating..."
                            className="px-6"
                        >
                            Update Request
                        </Button>
                    </div>

                </form>
            )}

        </div>
    )
}

export default EditMaintenanceRequestForm