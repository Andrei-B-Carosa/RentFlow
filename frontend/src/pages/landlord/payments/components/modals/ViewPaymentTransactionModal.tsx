import type { PaymentProps } from "../../core/types";

interface Props {
    data : PaymentProps;
}

const statusStyle: Record<string, string> = {
    PAID:       'bg-green-200 text-green-600 border-green-300',
    PARTIAL:    'text-blue-600 bg-blue-200 border-blue-300',
    LATE:       'bg-yellow-200 text-yellow-600 border-yellow-300',
    PENDING:    'bg-gray-200 text-gray-600 border-gray-300',
}

const ViewPaymentTransactionModal = ({data}:Props) => {

    return (       
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
            
            <div className="">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Transaction History
                    </p>
                    <ul className="space-y-3">
                        {data.transactions.map((col, index) => (
                            <li className="rounded-xl border border-gray-200 bg-white p-3" key={index}>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {col.type} — ₱{col.amount_paid}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {col.formatted_paid_at ?? '—'}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border
                                        ${statusStyle[col.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                        {col.status}
                                    </span>
                                </div>
                                {col.landlord_notes && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {col.landlord_notes}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
                    


        </div>
    )

}

export default ViewPaymentTransactionModal;