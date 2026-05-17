import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useController } from '../../core/requests'
import type { PaymentProps } from '../../core/types'
import Input   from '../../../../../components/common/Input'
import Button  from '../../../../../components/common/Button'
import { handleApiError } from '../../../../../utils/errorHandler'
import swal from '../../../../../utils/swal'
import LeaseSelect from '../../../../../components/common/select/LeaseSelect'

interface Props {
    id?:       string
    data?:     PaymentProps
    onSuccess: () => void
}

const PAYMENT_STATUSES = ['PENDING', 'PAID', 'PARTIAL', 'LATE']

const PAYMENT_TYPES = [
    { value: 'RENT',         label: 'Rent',          desc: 'Regular monthly rent'        },
    { value: 'EXTRA_CHARGE', label: 'Extra Charge',  desc: 'One-time charge to tenant'   },
    { value: 'DEPOSIT',      label: 'Deposit',       desc: 'Security deposit'             },
]

const Schema = Yup.object({
    lease_id: Yup.string().required('Lease is required'),
    amount:   Yup.number().required('Amount is required').min(0),
    late_fee: Yup.number().nullable().min(0),
    due_date: Yup.date().required('Due date is required'),
    paid_at:  Yup.date().nullable()
        .when('status', {
            is:        'PAID',
            then:      (schema) => schema.required('Paid date is required when status is PAID'),
            otherwise: (schema) => schema.nullable(),
        }),
    status:   Yup.string().required('Status is required'),
    notes:    Yup.string().nullable(),
    type:Yup.string().required('Payment type is required'),
})

const formatDateForInput = (date: string | null | undefined): string => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

const CreatePaymentForm = ({ id, data, onSuccess }: Props) => {

    const isEdit     = !!data && !!id
    const controller = useController()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            lease_id: data?.lease_id ?? '',
            amount:   data?.amount   ?? '',
            late_fee: data?.late_fee ?? '',
            due_date: formatDateForInput(data?.due_date),
            paid_at:  formatDateForInput(data?.paid_at),
            status:   data?.status   ?? 'PENDING',
            notes:    data?.notes    ?? '',
            type:     data?.type ?? 'RENT',
        },
        validationSchema: Schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                swal.loading(isEdit ? 'Updating payment...' : 'Recording payment...')
                if (isEdit) {
                    await controller.updatePayment(id, values)
                } else {
                    await controller.createPayment(values)
                }
                swal.close()
                swal.ok(isEdit
                    ? 'Payment updated successfully!'
                    : 'Payment recorded successfully!'
                )
                onSuccess()
            } catch (error: any) {
                swal.close()
                handleApiError(error)
            } finally {
                setSubmitting(false)
            }
        },
    })

    const isLocked = isEdit && data?.status === 'PAID'

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">

            {/* Locked notice */}
            {isLocked && (
                <div className="flex items-start gap-3 px-4 py-3 bg-green-50
                    border border-green-200 rounded-lg">
                    <span className="flex-shrink-0 mt-0.5">✅</span>
                    <div>
                        <p className="text-sm font-semibold text-green-800">
                            This payment has been marked as paid
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                            Paid payments are read-only.
                        </p>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {PAYMENT_TYPES.map((type) => (
                        <label
                            key={type.value}
                            className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition
                                ${formik.values.type === type.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="type"
                                value={type.value}
                                checked={formik.values.type === type.value}
                                onChange={() => formik.setFieldValue('type', type.value)}
                                className="hidden"
                            />
                            <span className={`text-sm font-bold
                                ${formik.values.type === type.value
                                    ? 'text-blue-700'
                                    : 'text-gray-700'
                                }`}>
                                {type.label}
                            </span>
                            <span className={`text-xs leading-relaxed
                                ${formik.values.type === type.value
                                    ? 'text-blue-500'
                                    : 'text-gray-400'
                                }`}>
                                {type.desc}
                            </span>
                        </label>
                    ))}
                </div>
                {formik.touched.type && formik.errors.type && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.type}</p>
                )}
            </div>

            {/* Lease select */}
            <LeaseSelect
                label="Lease"
                value={formik.values.lease_id}
                onChange={(val) => formik.setFieldValue('lease_id', val)}
                onBlur={() => formik.setFieldTouched('lease_id', true)}
                error={formik.errors.lease_id}
                touched={formik.touched.lease_id}
                disabled={isEdit}
            />

            {/* Amount + Late fee */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Amount (₱)"
                    name="amount"
                    type="number"
                    placeholder="e.g. 10000"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.amount}
                    touched={formik.touched.amount}
                    disabled={isLocked}
                />
                <Input
                    label="Late Fee (₱)"
                    name="late_fee"
                    type="number"
                    placeholder="e.g. 500"
                    value={formik.values.late_fee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.late_fee}
                    touched={formik.touched.late_fee}
                    disabled={isLocked}
                />
            </div>

            {/* Due date + Paid at */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Due Date"
                    name="due_date"
                    type="date"
                    placeholder=""
                    value={formik.values.due_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.due_date}
                    touched={formik.touched.due_date}
                    disabled={isLocked}
                />
                <Input
                    label="Paid Date"
                    name="paid_at"
                    type="date"
                    placeholder=""
                    value={formik.values.paid_at}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.paid_at}
                    touched={formik.touched.paid_at}
                    disabled={isLocked}
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLocked}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                        text-sm outline-none transition focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500 bg-white disabled:bg-gray-50
                        disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                {formik.touched.status && formik.errors.status && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.status}</p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                    <span className="text-gray-400 font-normal"> (optional)</span>
                </label>
                <textarea
                    name="notes"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLocked}
                    placeholder="Add notes about this payment..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                        text-sm outline-none transition focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500 resize-none disabled:bg-gray-50
                        disabled:text-gray-400 disabled:cursor-not-allowed"
                />
            </div>

            {/* Submit */}
            {!isLocked && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <Button
                        type="submit"
                        loading={formik.isSubmitting}
                        loadingText={isEdit ? 'Updating...' : 'Recording...'}
                        className="px-6"
                    >
                        {isEdit ? 'Update Payment' : 'Record Payment'}
                    </Button>
                </div>
            )}

        </form>
    )
}

export default CreatePaymentForm