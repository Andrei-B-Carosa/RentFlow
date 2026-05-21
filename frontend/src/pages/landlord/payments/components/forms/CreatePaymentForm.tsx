import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useController } from '../../core/requests'
import type { PaymentProps } from '../../core/types'
import Input          from '../../../../../components/common/Input'
import Button         from '../../../../../components/common/Button'
import { handleApiError } from '../../../../../utils/errorHandler'
import swal           from '../../../../../utils/swal'
import LeaseSelect    from '../../../../../components/common/select/LeaseSelect'

interface Props {
    id?:       string
    data?:     PaymentProps
    onSuccess: () => void
}

const PAYMENT_TYPES = [
    {
        value: 'EXTRA_CHARGE',
        label: 'Extra Charge',
        desc:  'One-time charge to tenant e.g. repairs, damages',
    },
    {
        value: 'DEPOSIT',
        label: 'Deposit',
        desc:  'Security deposit collected from tenant',
    },
]

const Schema = Yup.object({
    lease_id: Yup.string().required('Lease is required'),
    type:     Yup.string().required('Payment type is required'),
    amount:   Yup.number().required('Amount is required').min(1, 'Amount must be greater than 0'),
    paid_at:  Yup.date().required('Paid date is required'),
    notes:    Yup.string().nullable(),
})

const formatDateForInput = (date: string | null | undefined): string => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

const today = formatDateForInput(new Date().toISOString())

const CreatePaymentForm = ({ id, data, onSuccess }: Props) => {

    const isEdit     = !!data && !!id
    const controller = useController()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            lease_id: data?.lease_id              ?? '',
            type:     data?.type                  ?? 'EXTRA_CHARGE',
            amount:   data?.amount                ?? '',
            paid_at: formatDateForInput(data?.paid_at) || today,
            notes:    data?.notes                 ?? '',
        },
        validationSchema: Schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                swal.loading(isEdit ? 'Updating...' : 'Creating charge...')
                if (isEdit) {
                    await controller.updatePayment(id, values)
                } else {
                    await controller.createPayment(values)
                }
                swal.close()
                swal.ok(isEdit
                    ? 'Payment updated successfully!'
                    : 'Charge created successfully!'
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
                            This payment has been fully paid
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                            Paid records are read-only.
                        </p>
                    </div>
                </div>
            )}

            {/* Payment Type — radio cards */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {PAYMENT_TYPES.map((type) => (
                        <label
                            key={type.value}
                            className={`flex flex-col gap-1 p-4 rounded-xl border-2
                                cursor-pointer transition
                                ${isLocked ? 'cursor-not-allowed opacity-60' : ''}
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
                                onChange={() => !isLocked && formik.setFieldValue('type', type.value)}
                                className="hidden"
                                disabled={isLocked}
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

            {/* Lease */}
            <LeaseSelect
                label="Lease"
                value={formik.values.lease_id}
                onChange={(val) => formik.setFieldValue('lease_id', val)}
                onBlur={() => formik.setFieldTouched('lease_id', true)}
                error={formik.errors.lease_id}
                touched={formik.touched.lease_id}
                disabled={isEdit}
            />

            {/* Amount */}
            <Input
                label={`Amount Paid ${formik.values.type === 'DEPOSIT'
                    ? '— Security deposit'
                    : '— Charge amount'}`}
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

            {/* Payment Date */}
            <Input
                label="Payment Date"
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
                    placeholder={formik.values.type === 'DEPOSIT'
                        ? 'e.g. Security deposit for Unit 1A lease'
                        : 'e.g. Broken window repair charge'
                    }
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
                        loadingText={isEdit ? 'Updating...' : 'Creating...'}
                        className="px-6"
                    >
                        Save Payment
                    </Button>
                </div>
            )}

        </form>
    )
}

export default CreatePaymentForm