import { useNavigate } from "react-router-dom";
import { useTableHook } from "../../../hooks/useDatatableHook";
import { PropertyDatatable } from "./components/tables/Datatable";
import { useController } from "./core/requests";
import type { PropertyProps } from "./core/types";
import { ROUTES } from "../../../constants/routes";
import Button from "../../../components/common/Button";


const PropertiesPage = () => {

    const controller = useController();
    const table = useTableHook<PropertyProps>(ROUTES.LANDLORD.PROPERTIES);
    const navigate = useNavigate();

    const handleCreate = () => {

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
        <div className="p-6">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Manage your rental properties
                    </p>
                </div>
                <Button
                    variant="primary"
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
                onSearchChange={(val) => {
                    table.setPage(1)
                    table.setSearch(val)
                }}
                setRefreshTable={table.setRefreshTable}
            />
        </div>
    )

}

export default PropertiesPage;