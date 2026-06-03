import Button from "../../../../../components/common/Button";
import { DataTableHandler, type Column } from "../../../../../components/common/datatable/DatatableHandler";
import type { Maintenance } from "../../core/types";

interface Props {
    data:                   Maintenance[]
    loading:                boolean
    pagination:             any
    sortColumn:             string
    sortDirection:          'asc' | 'desc'
    onPageChange:           (page: number) => void
    onSortChange:           (col: string, dir: 'asc' | 'desc') => void
    onEdit?:               (id: string) => void
    onView?:               (id: string) => void
    onArchive?:           (id: string, setRefreshTable?: (refresh: boolean) =>void) => void
    setRefreshTable?:     (refresh: boolean) =>void
    onSearchChange?:      (value: any) => void
}

const MaintenanceRequestDatatable = ({
    data,
    loading,
    pagination,
    sortColumn,
    sortDirection,
    onPageChange,
    onSortChange,
    onView,
    onEdit,
    onArchive,
    onSearchChange,
    setRefreshTable,
}: Props) => {
    const columns: Column<Maintenance>[] = [
            {
            title:  '#',
            key:    'row_number',
            sortable: false,
            },
            {
            title:  'Title',
            key:    'title',
            sortable: true,
            },
            {
            title:  'Description',
            key:    'description',
            sortable: false,
            },
            {
            title:  'Priority',
            key:    'priority',
            sortable: true,
            },
            {
            title:  'Status',
            key:    'status',
            sortable: true,
            },
            {
                title:'Request Date', key:'formatted_date', sortable: true,
            },
            {
                title:'Resolved Date', key:'formatted_resolved_date', sortable: true,
                render:(item)=>(
                    item.formatted_resolved_at != '' ? item.formatted_resolved_at : '—'
                )
            },
            {
                title: 'Action',key: 'id',
                render: (item) => (
                    <div className="flex items-center gap-2">
                        {onView && (
                            <Button
                                onClick={() => onView(item.id)}
                                className="px-3 py-1.5 text-xs font-medium text-blue-600
                                    bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            >
                                View
                            </Button>
                        )}
                    </div>
                ),
            }
        
    ]
    return (
       <div className="w-full">
            <DataTableHandler<Maintenance>
                data={data}
                columns={columns}
                loading={loading}
                pagination={pagination}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onPageChange={onPageChange}
                onSortChange={onSortChange}
                onSearchChange={onSearchChange}
            />
        </div>
    )
}

export default MaintenanceRequestDatatable;