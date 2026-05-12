import { useEffect, useState } from "react";
import { useController } from "./core/requests";
import type { User as UserProps } from "../../../types";
import type {MaintenanceRequestProps} from "../maintenance/core/type"
import type {PaymentProps} from "../payments/core/types"
import type {LeaseProps} from "../leases/core/types"
import { useModal } from "../../../components/common/modal/ModalProvider";
import CreateTenantForm from "./component/forms/CreateTenantForm";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, User, Home, DollarSign, ShieldCheck, Calendar, Hash } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import Button from "../../../components/common/Button";

const paymentStatusStyle: Record<string, string> = {
    PAID:    'text-green-600 bg-green-50 border-green-100',
    PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    LATE:    'text-red-600 bg-red-50 border-red-100',
    PARTIAL: 'text-orange-600 bg-orange-50 border-orange-100',
}

const maintenancePriorityStyle: Record<string, string> = {
    LOW:    'text-gray-500',
    MEDIUM: 'text-blue-600',
    HIGH:   'text-orange-600',
    URGENT: 'text-red-600',
}

const maintenanceStatusStyle: Record<string, { dot: string; label: string }> = {
    OPEN:        { dot: 'bg-blue-500',   label: 'Open'        },
    IN_PROGRESS: { dot: 'bg-yellow-500', label: 'In Progress' },
    RESOLVED:    { dot: 'bg-green-500',  label: 'Resolved'    },
}

const formatCurrency = (amount: number | string) =>
    `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`

// filter tabs
const paymentTabs    = ['ALL', 'PAID', 'PENDING', 'LATE', 'PARTIAL']
const maintTabs      = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED']

const TenantDetailPage = () => {

    const { id: tenant_id }       = useParams()
    const navigate                = useNavigate()
    const controller              = useController()
    const { showModal, closeModal } = useModal()

    const [data, setData]                   = useState<UserProps | null>(null)
    const [paymentFilter, setPaymentFilter] = useState('ALL')
    const [maintFilter, setMaintFilter]     = useState('ALL')

    const fetchTenantDetail = async () => {
        if (!tenant_id) return
        const res = await controller.viewUser(tenant_id)
        setData(res?.data ?? null)
    }

    useEffect(() => { fetchTenantDetail() }, [tenant_id])

    const handleEdit = () => {
        showModal({
            title:   'Edit Tenant',
            size:    'xl',
            loading: false,
            body: (
                <CreateTenantForm
                    onSuccess={() => { closeModal(); fetchTenantDetail() }}
                    data={data}
                    id={tenant_id}
                />
            ),
        })
    }

    if (!data) return null

    const activeLease   = data.leases?.find((l: LeaseProps) => l.status === 'ACTIVE') ?? null
    const allPayments   = data.leases?.flatMap((l: LeaseProps) => l.payments ?? []) ?? []
    const maintenance   = data.maintenance_requests ?? []

    const filteredPayments = paymentFilter === 'ALL'
        ? allPayments
        : allPayments.filter((p: PaymentProps) => p.status === paymentFilter)

    const filteredMaintenance = maintFilter === 'ALL'
        ? maintenance
        : maintenance.filter((m: MaintenanceRequestProps) => m.status === maintFilter)

    const daysRemaining = activeLease
        ? Math.max(0, Math.ceil((new Date(activeLease.end_date).getTime() - Date.now()) / 86400000))
        : 0

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Back nav */}
                    <div className="px-6 h-14 flex items-center border-b border-gray-100">
                        <button
                            onClick={() => navigate(ROUTES.LANDLORD.TENANTS)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Tenants
                        </button>
                    </div>

                    {/* Avatar + name + actions */}
                    <div className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                {data.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                        {data.name}
                                    </h1>
                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider
                                        ${data.status === 'ACTIVE'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-red-50 text-red-500 border-red-100'
                                        }`}>
                                        {data.status}
                                    </span>
                                </div>
                                <p className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-0.5">
                                    <Mail className="w-3 h-3" />
                                    {data.email}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            onClick={handleEdit}
                            className="px-5"
                        >
                            Edit Details
                        </Button>
                    </div>

                    {/* Quick stats strip */}
                    <div className="px-8 py-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50">

                        {/* Residence */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                <Home className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                    Residence
                                </p>
                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                    {activeLease?.unit?.property?.name ?? '—'}
                                    {activeLease?.unit?.unit_number && (
                                        <span className="text-blue-600 ml-1.5">
                                            {activeLease.unit.unit_number}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Monthly rent */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                    Monthly Rent
                                </p>
                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                    {activeLease ? formatCurrency(activeLease.monthly_rent) : '—'}
                                    <span className="text-xs font-medium text-gray-400 ml-1">/mo</span>
                                </p>
                            </div>
                        </div>

                        {/* Lease end */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                    Lease Ends
                                </p>
                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                    {activeLease ? activeLease.formatted_end_date : '—'}
                                    {activeLease && (
                                        <span className="text-[10px] font-medium text-gray-400 ml-1.5">
                                            {daysRemaining}d left
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer meta strip */}
                    <div className="px-8 py-3 flex flex-wrap gap-6 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2">
                            <Hash className="w-3 h-3 text-gray-300" />
                            <span className="text-[11px] font-semibold text-gray-500">
                                {activeLease?.id?.substring(0, 8).toUpperCase() ?? 'No lease'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                            <Calendar className="w-3 h-3 text-gray-300" />
                            <span className="text-[11px] font-semibold text-gray-500 italic">
                                Started {activeLease ? activeLease.formatted_start_date : '—'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                            <User className="w-3 h-3 text-gray-300" />
                            <span className="text-[11px] font-semibold text-gray-500">
                                Member since {data.formatted_date}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Header + filter tabs */}
                    <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-800">Payment History</h2>
                        <div className="flex gap-1.5 flex-wrap">
                            {paymentTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setPaymentFilter(tab)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider transition
                                        ${paymentFilter === tab
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {['Due Date', 'Unit', 'Amount', 'Late Fee', 'Status', 'Paid On'].map(col => (
                                        <th key={col} className="px-8 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-10 text-center text-gray-400 text-sm">
                                            No payment records found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment: PaymentProps, index: number) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-4 text-sm font-bold text-gray-700">
                                                {payment.formatted_due_date}
                                            </td>
                                            <td className="px-8 py-4 text-sm text-gray-500">
                                                {payment.lease?.unit?.unit_number ?? '—'}
                                            </td>
                                            <td className="px-8 py-4 text-sm font-black text-gray-900">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td className="px-8 py-4 text-sm text-gray-500">
                                                {Number(payment.late_fee) > 0
                                                    ? formatCurrency(payment.late_fee)
                                                    : '—'
                                                }
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider
                                                    ${paymentStatusStyle[payment.status] ?? 'text-gray-500 bg-gray-50 border-gray-100'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm text-gray-500">
                                                {payment.formatted_paid_at}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── MAINTENANCE REQUESTS ──────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Header + filter tabs */}
                    <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-800">Maintenance Requests</h2>
                        <div className="flex gap-1.5 flex-wrap">
                            {maintTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setMaintFilter(tab)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider transition
                                        ${maintFilter === tab
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {['Request', 'Priority', 'Status', 'Submitted'].map(col => (
                                        <th key={col} className="px-8 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMaintenance.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center text-gray-400 text-sm">
                                            No maintenance requests found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMaintenance.map((item: MaintenanceRequestProps, index: number) => {
                                        const statusInfo = maintenanceStatusStyle[item.status] ?? { dot: 'bg-gray-400', label: item.status }
                                        return (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                                    {item.description && (
                                                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider
                                                        ${maintenancePriorityStyle[item.priority] ?? 'text-gray-500'}`}>
                                                        {item.priority}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusInfo.dot}`} />
                                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-500">
                                                    {item.formatted_date}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TenantDetailPage