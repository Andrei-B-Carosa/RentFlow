import Button from "../../../../../components/common/Button";
import { DataTableHandler, type Column } from "../../../../../components/common/datatable/DatatableHandler";
import type { LeaseProps } from "../../core/types";

type Props = {
  data:                 LeaseProps[]
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
    ACTIVE:     'bg-green-50 text-green-600 border-green-100',
    EXPIRED:    'bg-gray-50 text-gray-500 border-gray-100',
    TERMINATED: 'bg-red-50 text-red-500 border-red-100',
}

export const LeaseDatatable = ({
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

    const columns: Column<LeaseProps>[] = [
        {
        title:  '#',
        key:    'row_number',
        sortable: false,
        },
        {
            title:'Property', key: 'name', sortable: true,
            render:(item)=>(
                <div className="flex items-center gap-4">
                    <img
                        src={`${import.meta.env.VITE_STORAGE_URL}/${item.unit?.property?.photos[0]}`}
                        alt={item.unit?.property?.name}
                        className="w-12 h-12 rounded-sm object-cover flex-shrink-0"
                    />
                    <span className="font-semibold text-gray-900">
                        {item.unit?.property?.name}
                    </span>
                </div>
            )
        },
        {
            title:    'Unit',
            key:      'unit',
            sortable: false,
            render:   (item) => (
                <span>{item.unit?.unit_number ?? '—'}</span>
            )
        },
        {
            title:    'Tenant',
            key:      'tenant',
            sortable: false,
            render:   (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {item.tenant?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                        {item.tenant?.name ?? '—'}
                    </span>
                </div>
            )
        },
        {
            title:'Monthly Rent', key: 'monthly_rent', sortable: false
        },
        {
            title:'Deposit', key: 'deposit_amount', sortable: false
        },
        {
            title:'Notes', key: 'landlord_notes', sortable: false,
            render:(item)=>{
                return (item.landlord_notes??'—')
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
                            View Lease
                        </Button>
                    )}
                    {onArchive && item.status=='ACTIVE' && (
                        <Button
                            onClick={() => onArchive(item.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white-600
                                bg-red-500 hover:bg-red-600 rounded-lg transition"
                        >
                            Terminate Lease
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <DataTableHandler<LeaseProps>
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
