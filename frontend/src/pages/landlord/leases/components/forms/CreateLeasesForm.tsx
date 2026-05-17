import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useController } from '../../core/requests'
import type { LeaseProps } from '../../core/types'
import UnitSelect     from '../../../../../components/common/select/UnitSelect'
import TenantSelect   from '../../../../../components/common/select/TenantSelect'
import PropertySelect from '../../../../../components/common/select/PropertySelect'
import Input          from '../../../../../components/common/Input'
import Button         from '../../../../../components/common/Button'

interface Props {
    onSuccess:    () => void
    data?:        LeaseProps | null
    id?:          string | null
    property_id?: string
    unit_id?:     string
}

const MAX_FILE_SIZE       = 5 * 1024 * 1024  // 5MB
const SUPPORTED_FORMATS   = ['application/pdf']

const Schema = Yup.object({
    property_id:    Yup.string().required('Property is required'),
    unit_id:        Yup.string().required('Unit is required'),
    tenant_id:      Yup.string().required('Tenant is required'),
    start_date:     Yup.date().required('Start date is required'),
    end_date:       Yup.date().nullable().min(Yup.ref('start_date'),'End date must be after start date'),
    monthly_rent:   Yup.number().required('Monthly rent is required').min(0),
    deposit_amount: Yup.number().nullable().min(0),
    document:       Yup.mixed()
        .nullable()
        .test('fileSize', 'File too large — max 5MB', (value) => {
            if (!value) return true
            return (value as File).size <= MAX_FILE_SIZE
        })
        .test('fileType', 'Only PDF files are supported', (value) => {
            if (!value) return true
            return SUPPORTED_FORMATS.includes((value as File).type)
        }),
    landlord_notes: Yup.string().nullable(),
})

const CreateLeasesForm = ({onSuccess,data= null,id= null,property_id, unit_id,}: Props) => {

    const controller = useController()
    const isEdit     = !!data && !!id

    const formatDateForInput = (date: string | null | undefined): string => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0] 
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            property_id:    property_id         ?? '',
            unit_id:        data?.unit_id        ?? unit_id ?? '',
            tenant_id:      data?.tenant_id      ?? '',
            start_date:     formatDateForInput(data?.start_date) ?? '',
            end_date:       formatDateForInput(data?.end_date)   ?? '',
            monthly_rent:   data?.monthly_rent   ?? '',
            deposit_amount: data?.deposit_amount ?? '',
            document:       null as File | null,
            landlord_notes: data?.landlord_notes ?? '',
        },
        validationSchema: Schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isEdit) {
                    await controller.updateLease(id, values)
                } else {
                    await controller.createLease(values)
                }
                onSuccess()
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">

            {isEdit && data.status === 'TERMINATED' && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            This lease has been terminated
                        </p>
                        <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
                            This lease was ended and is now read-only. To house this tenant again, create a new lease.
                        </p>
                    </div>
                </div>
            )}

            {isEdit && data.status === 'EXPIRED' && (
                <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            This lease has expired
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            The lease period has ended and is now read-only. To renew, create a new lease for this tenant.
                        </p>
                    </div>
                </div>
            )}

            {isEdit && data.status==='ACTIVE' &&(
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
                    <div>
                        <p className="text-sm font-semibold text-amber-800">
                            Property and unit cannot be changed
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                            To move this tenant to a different unit, terminate this lease and create a new one.
                        </p>
                    </div>
                </div>
            )}

            {isEdit && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50
                        border border-gray-200 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {data?.unit?.property?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {data?.unit?.unit_number}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Property — hide if pre-filled */}
            {!property_id && (
                <PropertySelect
                    label="Property"
                    value={formik.values.property_id}
                    onChange={(val) => {
                        formik.setFieldValue('property_id', val)
                        formik.setFieldValue('unit_id', '')
                        formik.setFieldValue('tenant_id', '')
                    }}
                    onBlur={() => formik.setFieldTouched('property_id', true)}
                    error={formik.errors.property_id}
                    touched={formik.touched.property_id}
                />
            )}

            {/* Unit — hide if pre-filled */}
            {!unit_id && (
                <UnitSelect
                    label="Unit"
                    propertyId={formik.values.property_id || property_id}
                    value={formik.values.unit_id}
                    onChange={(val) => {
                        formik.setFieldValue('unit_id', val)
                        formik.setFieldValue('tenant_id', '')
                    }}
                    onBlur={() => formik.setFieldTouched('unit_id', true)}
                    error={formik.errors.unit_id}
                    touched={formik.touched.unit_id}
                    disabled={!formik.values.property_id && !property_id}
                />
            )}

            {/* Tenant */}
            {isEdit ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tenant
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50
                        border border-gray-200 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center
                            justify-center text-white text-[10px] font-bold">
                            {data?.tenant?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {data?.tenant?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {data?.tenant?.email}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <TenantSelect
                    label="Tenant"
                    value={formik.values.tenant_id}
                    onChange={(val) => formik.setFieldValue('tenant_id', val)}
                    onBlur={() => formik.setFieldTouched('tenant_id', true)}
                    error={formik.errors.tenant_id}
                    touched={formik.touched.tenant_id}
                    disabled={!formik.values.unit_id && !unit_id}
                />
            )}
            {/* Start date */}
            <Input
                label="Start Date"
                name="start_date"
                type="date"
                value={formik.values.start_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.start_date}
                touched={formik.touched.start_date}
                placeholder=""
                disabled={isEdit && data?.status!='ACTIVE'}
            />

            {/* End date */}
            <Input
                label="End Date"
                name="end_date"
                type="date"
                value={formik.values.end_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.end_date}
                touched={formik.touched.end_date}
                placeholder=""
                disabled={isEdit && data?.status!='ACTIVE'}
            />

            {/* Monthly rent + deposit side by side */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Monthly Rent (₱)"
                    name="monthly_rent"
                    type="number"
                    placeholder="e.g. 10000"
                    value={formik.values.monthly_rent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.monthly_rent}
                    touched={formik.touched.monthly_rent}
                    disabled={isEdit && data?.status!='ACTIVE'}
                />
                <Input
                    label="Deposit Amount (₱)"
                    name="deposit_amount"
                    type="number"
                    placeholder="e.g. 20000"
                    value={formik.values.deposit_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.deposit_amount}
                    touched={formik.touched.deposit_amount}
                    disabled={isEdit && data?.status!='ACTIVE'}
                />
            </div>

            {/* Document upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease Document
                    <span className="text-gray-400 font-normal"> (PDF only, max 5MB)</span>
                </label>
                {/* Show existing document on edit */}
                {isEdit && data?.document_path && !formik.values.document && (
                    <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-blue-50
                        border border-blue-100 rounded-lg text-sm text-blue-600">
                        <span>📄 Existing document</span>
                        
                        <a href={`${import.meta.env.VITE_STORAGE_URL}/${data.document_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-xs"
                        >
                            View
                        </a>
                    </div>
                )}
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                        formik.setFieldValue('document', e.target.files?.[0] ?? null)
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0 file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100
                        cursor-pointer"
                    disabled={isEdit && data?.status!='ACTIVE'}
                    
                />
                {formik.touched.document && formik.errors.document && (
                    <p className="mt-1 text-xs text-red-500">{String(formik.errors.document)}</p>
                )}
            </div>

            {/* Landlord notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                    <span className="text-gray-400 font-normal"> (optional)</span>
                </label>
                <textarea
                    name="landlord_notes"
                    value={formik.values.landlord_notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Internal notes about this lease..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                        outline-none transition focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500 resize-none"
                    disabled={isEdit && data?.status!='ACTIVE'}
                />
            </div>

            {/* Submit */}
            {data?.status=='ACTIVE' || !isEdit ? <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Button
                    type="submit"
                    loading={formik.isSubmitting}
                    loadingText={isEdit ? 'Updating...' : 'Creating...'}
                    className="px-6"
                >
                    {isEdit ? 'Update Lease' : 'Create Lease'}
                </Button>
            </div> :''}

        </form>
    )
}

export default CreateLeasesForm