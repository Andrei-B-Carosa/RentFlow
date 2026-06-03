import { useTableHook } from "../../../hooks/useDatatableHook";
import { ROUTES } from "../../../constants/routes";
import { useModal } from "../../../components/common/modal/ModalProvider";
import MaintenanceRequestDatatable from "./components/tables/Datatable";
import type { Maintenance } from "./core/types";
import Button from "../../../components/common/Button";
import CreateMaintenanceRequestForm from "./components/forms/CreateMaintenanceRequest";
import { useController } from "./core/requests";
import ViewMaintenanceRequestModal from "./components/modals/ViewMaintenanceRequestModal";

const MaintenancePage = () => {
    const table = useTableHook<Maintenance>(ROUTES.TENANT.MAINTENANCE)
    const { showModal, closeModal } = useModal()
    const controller = useController();

    const handleView = async(id: string) => {
        const res = await controller.viewMaintenanceRequest(id)
        if(!res)return
        showModal({
            title: 'Maintenance Details',
            body: <ViewMaintenanceRequestModal data={res.data}/>,
            size: 'xl',
        })
    }
    const handleCreate = () => {
        showModal({
            title:      'Maintenance Request',
            body:       <CreateMaintenanceRequestForm
                            onSuccess={()=>{
                                table.setRefreshTable(true)
                                closeModal()
                            }}
                        />,
            size:      'xl',
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
                    <Button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        + New Request
                    </Button>
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
                    onView={handleView}
                    setRefreshTable={table.setRefreshTable}
                />
            </div>
        </div>
    )
}   

export default MaintenancePage;