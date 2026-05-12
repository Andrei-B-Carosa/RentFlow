import { useModal } from "../../../components/common/modal/ModalProvider";
import { ROUTES } from "../../../constants/routes";
import { useTableHook } from "../../../hooks/useDatatableHook";
import EditMaintenanceRequestForm from "./components/forms/EditMaintenanceRequestForm";
import { MaintenanceRequestDatatable } from "./components/tables/Datatable";
import { useController } from "./core/requests";
import { type MaintenanceRequestProps } from "./core/type";

const MaintenancePage = () => {

    const table = useTableHook<MaintenanceRequestProps>(ROUTES.LANDLORD.MAINTENANCE);

    const controller = useController();
    const {showModal, closeModal} = useModal();

    const handleEdit = async(id:string) => {
       const res = await controller.viewMaintenance(id);
       if(!res) return;
        
       showModal({
            title:'Maintenance request details',
            body:<EditMaintenanceRequestForm
                    onSuccess={() => {
                        closeModal()
                        table.setRefreshTable(true)
                    }}
                    data={res.data}
                    id={id}
                />,       
            size:'xl',
            loading:false
        })

    }

    const handleDelete = async (id:string) => {
       const res = await controller.deleteMaintenance(id);
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
            </div>
            <MaintenanceRequestDatatable 
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

export default MaintenancePage;