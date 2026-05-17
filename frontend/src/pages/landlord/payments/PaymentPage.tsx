import Button from "../../../components/common/Button";
import { useModal } from "../../../components/common/modal/ModalProvider";
import { ROUTES } from "../../../constants/routes";
import { useTableHook } from "../../../hooks/useDatatableHook";
import CreatePaymentForm from "./components/forms/CreatePaymentForm";
import { PaymentDatatable } from "./components/tables/Datatable";
import { useController } from "./core/requests";
import type { PaymentProps } from "./core/types";

const PaymentPage = () => {
    const table = useTableHook<PaymentProps>(ROUTES.LANDLORD.PAYMENTS)
    const controller = useController();

    const {showModal, closeModal} = useModal();

    const handleCreate = () =>{
        showModal({
            title:      'New Payment',
            body:       <CreatePaymentForm 
                            onSuccess={() => {
                                closeModal()
                                table.setRefreshTable(true)
                            }}
                        />,
            size:      'xl'
        });
    }

    const handleEdit = () =>{
        showModal({
            title:      'Edit Payment',
            body:       '',
            size:      'xl'
        });
    }

    const handleDelete =async (id:string) =>{
        if(!id) return;
        const res = await controller.deletePayment(id);
        if(res) table.setRefreshTable(true);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm mb-5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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
                <Button
                    variant="light-primary"
                    onClick={() => handleCreate()}
                >
                    + New Payment
                </Button>
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
                onView={handleEdit}
                onArchive={handleDelete}
                setRefreshTable={table.setRefreshTable}
            />
        </div>
    )
}

export default PaymentPage;