import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useController } from '../../core/requests'
import type { PaymentProps } from '../../core/types'
import Input   from '../../../../../components/common/Input'
import Button  from '../../../../../components/common/Button'
import { handleApiError } from '../../../../../utils/errorHandler'
import swal from '../../../../../utils/swal'
import LeaseSelect from '../../../../../components/common/select/LeaseSelect'
import TextArea from '../../../../../components/common/TextArea'

interface Props {
    id:       string
    data?:     PaymentProps
    onSuccess: () => void
}

const Schema = Yup.object({
    amount_paid : Yup.number().min(1, 'Must be greater than 0').required('Amount paid is required'),
    paid_at     : Yup.date().required('Paid date is required'),
    notes       : Yup.string().nullable(),
    late_fee    : Yup.number().min(1,'Must be greater than 0').nullable(),
})

const statusStyle: Record<string, string> = {
    PAID:       'bg-green-200 text-green-600 border-green-300',
    PARTIAL:    'text-blue-600 bg-blue-200 border-blue-300',
    LATE:       'bg-yellow-200 text-yellow-600 border-yellow-300',
    PENDING:    'bg-gray-200 text-gray-600 border-gray-300',
}

const UpdatePaymentTransaction = ({ id, data, onSuccess }: Props) => {

    const isEdit     = !!data && !!id
    const controller = useController()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            amount_paid: '',
            paid_at:    '',
            notes:  '',
            late_fee: '',
        },
        validationSchema: Schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await controller.updatePayment(id, values)
                onSuccess()
            } finally {
                setSubmitting(false)
            }
        },
    })

    const isLocked = isEdit && data?.status === 'PAID'

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">

                {/* Title */}
                <div className="">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Property
                        </p>
                        <p className="">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-800 mb-0">
                                    {data?.lease.unit?.property?.name ?? '—'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {data?.lease.unit?.unit_number ?? '—'}
                                </p>
                            </div>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Tenant
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {data?.lease.tenant.name ?? '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Payment Status
                        </p>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider
                            ${statusStyle[data?.status ?? ''] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            {data?.status ?? '—'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4"> 
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Paid Date
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {data?.formatted_paid_at != ''?data?.formatted_paid_at: '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Due Date
                        </p>
                        <p className="text-sm text-gray-600">
                            {data?.formatted_due_date}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Amount
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {'₱'+data?.amount} {data?.late_fee !== '0.00'? '+'+data?.late_fee+' late fee' :''} 
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Remaining
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            ₱{data?.remaining_balance ?? '—'}
                        </p>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Notes
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {data?.notes ?? '—'}
                    </p>
                    </div>
                </div>
                


            </div>

            <Input
                type="text"
                placeholder="Amount Paid"
                name="amount_paid"
                label="Amount Paid"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.amount_paid}
                error={formik.errors.amount_paid}
                touched={formik.touched.amount_paid}
            />

            
            <Input
                label="Late fee"
                name="late_fee"
                type="number"
                placeholder="e.g. 10000"
                value={formik.values.late_fee}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.late_fee}
                touched={formik.touched.late_fee}
                disabled={isLocked}
            />

            <Input
                type="date"
                placeholder="Paid At"
                name="paid_at"
                label="Paid date"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.paid_at}
                error={formik.errors.paid_at}
                touched={formik.touched.paid_at}
            />

            <TextArea
                name='notes'
                value={formik.values.notes}
                placeholder="Remarks ..."
                rows={4}
                onChange={formik.handleChange}
                onBlur ={formik.handleBlur}
                label="notes"
            />

            {!isLocked && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <Button
                        type="submit"
                        loading={formik.isSubmitting}
                        loadingText="Recording..."
                        className="px-6"
                    >
                        Record Transaction
                    </Button>
                </div>
            )}

        </form>
    )
}

export default UpdatePaymentTransaction