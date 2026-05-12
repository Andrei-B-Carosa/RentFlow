import Button from "../../../components/common/Button";
import { useModal } from "../../../components/common/modal/ModalProvider";
import { ROUTES } from "../../../constants/routes";
import { useTableHook } from "../../../hooks/useDatatableHook";
import CreateLeasesForm from "./components/forms/CreateLeasesForm";
import {LeaseDatatable} from "./components/tables/Datatable";
import { useController } from "./core/requests";
import type { LeaseProps } from "./core/types";

const LeasesPage = () => {

    const table = useTableHook<LeaseProps>(ROUTES.LANDLORD.LEASES);

    const controller = useController();
    const {showModal, closeModal} = useModal();

    const handleCreate = () => {
        showModal({
            title:'New Tenant',
            body:<CreateLeasesForm
                    onSuccess={() => {
                        closeModal()
                        table.setRefreshTable(true)
                    }}
                />,       
            size:'xl',
            loading:false
        })
    }

    const handleEdit = async(id:string) => {
       const res = await controller.viewLease(id);
       if(!res) return;
        
       showModal({
            title:'Lease Details',
            body:<CreateLeasesForm
                    onSuccess={() => {
                        closeModal()
                        table.setRefreshTable(true)
                    }}
                    data={res.data}
                    id={id}
                    property_id={res.data?.unit?.property?.id}
                    unit_id={res.data?.unit_id}
                />,       
            size:'xl',
            loading:false
        })

    }

    const handleDelete = async (id:string) => {
       const res = await controller.deleteLease(id);
       if(!res) return;
       table.setRefreshTable(true);
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
                    + New Lease
                </Button>
            </div>
            <LeaseDatatable 
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
    );

}

export default LeasesPage;