import { useNavigate } from "react-router-dom";
import { useTableHook } from "../../../hooks/useDatatableHook";
import { PropertyDatatable } from "./components/tables/Datatable";
import { useController } from "./core/requests";
import type { PropertyProps } from "./core/types";
import { ROUTES } from "../../../constants/routes";
import Button from "../../../components/common/Button";
import { useModal } from "../../../components/common/modal/ModalProvider";
import CreatePropertyForm from "./components/forms/CreatePropertyForm";
import swal from "../../../utils/swal";


const PropertiesPage = () => {

    const navigate = useNavigate();

    const controller = useController();
    const table = useTableHook<PropertyProps>(ROUTES.LANDLORD.PROPERTIES);
    const { showModal, closeModal } = useModal()

    const handleCreate = () => {
        showModal({
            title: 'New Property',
            size:  'xl',
            body: (
                <CreatePropertyForm
                    onSuccess={() => {
                        closeModal()
                        table.setRefreshTable(true)
                    }}
                />
            ),
        })
    }

    const handleView = (id:string) => { 
        navigate(ROUTES.LANDLORD.PROPERTY_DETAIL.replace(':id', id)) 
    }

    const handleDelete = async(id:string) => {
        const res = await controller.deleteProperty(id);
        if (!res) return;
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
                    + New Property
                </Button>
            </div>
            <PropertyDatatable 
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
                onArchive={handleDelete}
                // onSearchChange={(val) => {
                //     table.setPage(1)
                //     table.setSearch(val)
                // }}
                setRefreshTable={table.setRefreshTable}
            />
        </div>
    )

}

export default PropertiesPage;