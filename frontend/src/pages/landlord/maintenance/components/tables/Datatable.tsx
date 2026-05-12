import Button from "../../../../../components/common/Button";
import { DataTableHandler, type Column } from "../../../../../components/common/datatable/DatatableHandler";
import type { MaintenanceRequestProps } from "../../core/type";

type Props = {
  data:                 MaintenanceRequestProps[]
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

const statusStyle: Record<string, string> = {
    RESOLVED:     'bg-green-200 text-green-600 border-green-300',
    OPEN:    'text-blue-600 bg-blue-200 border-blue-300',
    IN_PROGRESS: 'bg-yellow-200 text-yellow-600 border-yellow-300',
}

export const MaintenanceRequestDatatable = ({
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

    const columns: Column<MaintenanceRequestProps>[] = [
        {
        title:  '#',
        key:    'row_number',
        sortable: false,
        },
        { title: 'Tenant', key: 'tenant', sortable: false,
            render: (item) => (
                <div className="flex items-center gap-1.5">
                <div>
                    <p className="font-medium text-gray-700">
                        {item.tenant?.name ?? '—'}
                    </p>
                    <p className="text-[12px] text-gray-400">
                        {item.tenant?.email ?? '—'}
                    </p>
                </div>
            </div>
            )
        },
        { title: 'Property', key: 'unit', sortable: false,
            render: (item) => (
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-800 mb-0">
                        {item.unit?.property?.name ?? '—'}
                    </p>
                    <p className="text-blue-600 font-semibold">
                        {item.unit?.unit_number ?? '—'}
                    </p>
                </div>
            )
        },
        {
            title:'Concern', key: 'title', sortable: false,
        },
        {
            title:'Description', key: 'description', sortable: false,
            render:   (item) => (
                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                    {item.description ?? '—'}
                </p>
            )
        },
        {
            title:'Notes', key: 'landlord_notes', sortable: false,
            render:(item)=>{
                return (item.landlord_notes??'—')
            }
        },
        {
            title:'Request At', key: 'formatted_date', sortable: false,
        },
        {
            title:'Resolved At', key: 'formatted_resolved_at', sortable: false,
            render:(item)=>{
                return (item.formatted_resolved_at??'—')
            }
        },
        {
            title:    'Status',
            key:      'status',
            sortable: false,
            render:   (item) => {
                return (
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider
                        ${statusStyle[item.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        {item.status}
                    </span>
                )
            }
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
                            View Request
                        </Button>
                    )}
                    {onArchive && item.status !='RESOLVED' &&(
                        <Button
                            onClick={() => onArchive(item.id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600
                                bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                            Delete Request
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <DataTableHandler<MaintenanceRequestProps>
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
