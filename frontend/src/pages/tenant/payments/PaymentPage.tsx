import { useModal } from "../../../components/common/modal/ModalProvider";
import { ROUTES } from "../../../constants/routes";
import { useTableHook } from "../../../hooks/useDatatableHook";
import PaymentReceiptModal from "./components/modals/PaymentReceiptModal";
import { PaymentDatatable } from "./components/tables/Datatable";
import { useController } from "./core/request";
import type { Payment } from "./core/type";

const PaymentPage = () => {
    const table = useTableHook<Payment>(ROUTES.TENANT.PAYMENTS)
    const controller = useController();
    const {showModal, closeModal} = useModal();

    const handleView = async(id:string)=>{
        const res = await controller.viewReceipt(id);
        if (!res) return;
        showModal({
            title:      'Payment Receipt',
            body:       <PaymentReceiptModal data={res.data} />,
            size:       'xl',
            loading:    false,
        })
    }

    return (
        <div className="bg-white rounded-1xl max-w-1xl mx-auto px-8 py-8 border border-zinc-200 space-y-8">
            <div className="bg-white rounded-xl shadow-sm mb-5">
                <div className="flex items-center justify-between px-6 py-4 border border-gray-100">
                    <input
                        type="text"
                        placeholder="Search here..."
                        onChange={(e) => {
                            table.setPage(1)
                            table.setSearch(e.target.value)
                        }}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                </div>
                <PaymentDatatable 
                    data={table.data}
                    loading={table.loading}
                    pagination={table.pagination}
                    sortColumn={table.sortColumn}
                    sortDirection={table.sortDirection}
                    onPageChange={table.setPage}
                    onSortChange={(col, dir) => {
                        table.setSortColumn(col)
                        table.setSortDirection(dir)
                    }}
                    onView={handleView}
                    setRefreshTable={table.setRefreshTable}
                />
            </div>
        </div>
        
    );
}

export default PaymentPage;