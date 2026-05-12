import Button from "../../../../../components/common/Button";
import { DataTableHandler, type Column } from "../../../../../components/common/datatable/DatatableHandler";
import type { User } from "../../../../../types";

type Props = {
  data:                 User[]
  loading:              boolean
  pagination:           any
  sortColumn:           string
  sortDirection:        'asc' | 'desc'
  onPageChange:         (page: number) => void
  onSortChange:         (col: string, dir: 'asc' | 'desc') => void
  onEdit?:              (id: string) => void
  onView:               (id: string) => void
  onArchive?:           (id: string, setRefreshTable?: (refresh: boolean) =>void) => void
  setRefreshTable?:     (refresh: boolean) =>void
  onSearchChange?:      (value: any) => void
}

export const TenantDatatable = ({
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

    const columns: Column<User>[] = [
        {
            title:'#', key: 'row_number', sortable: true
        },
        {
            title:'Tenant', key: 'name', sortable: true
        },
        {
            title:'Status', key:'is_active',sortable:false,
            render:(item)=>(
                <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                        item.status=='ACTIVE'
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-red-50 text-red-500 border-red-100"
                    }`}
                >
                    {item.status}
                </span>
            )
            
        },
        {
            title:'Created At', key: 'formatted_date', sortable: true
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
                            View User
                        </Button>
                    )}
                    {onArchive && (
                        <Button
                            onClick={() => onArchive(item.id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600
                                bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                            Archive User
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <DataTableHandler<User>
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
