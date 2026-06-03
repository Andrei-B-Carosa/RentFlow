import { useRef } from "react";
import type { Payment } from "../../core/type";

interface Props {
    data: Payment;
}

const formatCurrency = (value: number | string) =>
    Number(value).toLocaleString("en-PH", { style: "currency", currency: "PHP" });

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    PAID:    { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500"  },
    PARTIAL: { bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500"     },
    LATE:    { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500"    },
    PENDING: { bg: "bg-gray-100",    text: "text-gray-600",    dot: "bg-gray-400"     },
};

const PaymentReceiptModal = ({ data }: Props) => {
    const receiptRef = useRef<HTMLDivElement>(null);

    const property = data.lease?.unit?.property;
    const unit     = data.lease?.unit;
    const tenant   = data.lease?.tenant;
    const status   = statusColors[data.status] ?? statusColors.PENDING;

    const handlePrint = () => {
        const content = receiptRef.current?.innerHTML ?? "";
        const win = window.open("", "_blank", "width=800,height=900");
        if (!win) return;
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Receipt — ${data.id}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #111; }
                    .receipt-print { padding: 40px; max-width: 720px; margin: auto; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style>
            </head>
            <body><div class="receipt-print">${content}</div></body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
    };

    return (
        <div className="flex flex-col gap-0">

            {/* ── Receipt card ─────────────────────────────────── */}
            <div ref={receiptRef} className="bg-white rounded-2xl overflow-hidden">

                {/* Header band */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                                Official Payment Receipt
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight">
                                {property?.name ?? "—"}
                            </h2>
                            <p className="text-blue-100 text-sm mt-0.5">
                                {property?.address}{property?.city ? `, ${property.city}` : ""}
                            </p>
                        </div>

                        {/* Amount bubble */}
                        <div className="text-right">
                            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Amount Paid</p>
                            <p className="text-3xl font-extrabold">{formatCurrency(data.amount)}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className=" py-6 space-y-6">

                    {/* Tenant + Unit info */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Billed to */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Billed To
                            </p>
                            <p className="text-sm font-bold text-gray-800">{tenant?.name ?? "—"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{tenant?.email ?? ""}</p>
                        </div>

                        {/* Unit info */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Unit
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                                Unit {unit?.unit_number ?? "—"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Monthly Rent: {data.lease?.monthly_rent ? formatCurrency(data.lease.monthly_rent) : "—"}
                            </p>
                        </div>
                    </div>

                    {/* Payment details */}
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                            Payment Details
                        </p>
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Description</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">
                                            <div className="font-medium">{data.type === "RENT" ? "Monthly Rent" : data.type}</div>
                                        </td>
                                        <td className="px-4 py-3 text-left font-semibold text-gray-800">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold
                                                ${status.bg} ${status.text} border border-current/20`}>
                                                {data.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-800">
                                            {formatCurrency(data.amount)}
                                        </td>
                                    </tr>       
                                    {Number(data.late_fee) > 0 && (
                                        <tr>
                                            <td className="px-4 py-3 text-amber-600 font-medium">Late Fee</td>
                                            <td className="px-4 py-3 text-right font-semibold text-amber-600">
                                                {formatCurrency(data.late_fee)}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50 border-t border-blue-100">
                                        <td className="px-4 py-3 font-bold text-blue-800">Total Paid</td>
                                        <td></td>
                                        <td className="px-4 py-3 text-right font-extrabold text-blue-700 text-base">
                                            {formatCurrency(data.total_paid!==0 ? data.total_paid : data.amount)}
                                        </td>
                                    </tr>
                                    {data.type==='RENT' &&(<tr className="bg-blue-50 border-t border-blue-100">
                                        <td className="px-4 py-3 font-bold text-blue-800">Remaining Balance</td>
                                        <td></td>
                                        <td className="px-4 py-3 text-right font-extrabold text-blue-700 text-base">
                                            <p className={`text-sm font-semibold ${Number(data.remaining_balance) > 0 ? "text-amber-700" : "text-emerald-700" }`}>
                                                {formatCurrency(data.remaining_balance ?? 0)}
                                            </p>
                                        </td>
                                    </tr>)}
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Transactions breakdown */}
                    {data.transactions && data.transactions.length > 0 && (
                        <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                Transaction History
                            </p>
                            <div className="rounded-xl border border-gray-100 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">#</th>
                                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Type</th>
                                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Paid At</th>
                                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Notes</th>
                                            <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.transactions.map((txn, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border
                                                        ${txn.type === "RENT"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                                                        {txn.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-xs">{txn.formatted_paid_at || txn.paid_at}</td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">{txn.landlord_notes || "—"}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                                                    {formatCurrency(txn.amount_paid)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Due date + remaining balance row */}
                        <div className="grid grid-cols-2 gap-4">
                            {data.type==='RENT' && (
                                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
                                    <p className="text-sm font-semibold text-gray-700">{data.formatted_due_date || "—"}</p>
                                </div>
                            )}
                            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Paid Date</p>
                                <p className="text-sm font-semibold text-gray-700">{data.formatted_paid_at || "—"}</p>
                            </div>
                        </div>
                    {/* Footer stamp */}
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
                        <p className="text-[11px] text-gray-400">
                            This is an official computer-generated receipt. No signature required.
                        </p>
                        <p className="text-[11px] font-bold text-blue-600 tracking-wide">RentFlow</p>
                    </div>

                </div>
            </div>

            {/* ── Actions ─────────────────────────────────────── */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                        bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2
                            M6 14h12v8H6v-8z"/>
                    </svg>
                    Print Receipt
                </button>
            </div>

        </div>
    );
};

export default PaymentReceiptModal;