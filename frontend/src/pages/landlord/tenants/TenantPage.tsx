import Button from "../../../components/common/Button";
import { useModal } from "../../../components/common/modal/ModalProvider";
import { ROUTES } from "../../../constants/routes";
import { useTableHook } from "../../../hooks/useDatatableHook";
import type { User } from "../../../types";
import CreateTenantForm from "./component/forms/CreateTenantForm";
import {TenantDatatable} from "./component/tables/Datatable";
import { useController } from "./core/requests";
import { useNavigate } from "react-router-dom";


const TenantPage = () => {

    const table = useTableHook<User>(ROUTES.LANDLORD.TENANTS);
    const {showModal, closeModal} = useModal();
    const navigate = useNavigate();

    const controller = useController();

    const handleCreate = () => {
        showModal({
            title:'New Tenant',
            body:<CreateTenantForm
                    onSuccess={() => {
                        closeModal()
                        table.setRefreshTable(true)
                    }}
                />,       
            size:'xl',
            loading:false
        })
    }

    const handleView = async (id:string) => {
        if(!id) return;
        navigate(ROUTES.LANDLORD.TENANT_DETAIL.replace(':id',id));
    }

    const handleDelete = async(id:string) => {
        const res = await controller.deleteUser(id);
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
                    + New User
                </Button>
            </div>
            <TenantDatatable 
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
                setRefreshTable={table.setRefreshTable}
            />
        </div>
    );
}

export default TenantPage;