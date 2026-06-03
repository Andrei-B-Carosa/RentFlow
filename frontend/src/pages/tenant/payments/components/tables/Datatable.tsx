import Button from "../../../../../components/common/Button";
import { DataTableHandler, type Column } from "../../../../../components/common/datatable/DatatableHandler";
import type { Payment } from "../../core/type";

type Props = {
  data:                 Payment[]
  loading:              boolean
  pagination:           any
  sortColumn:           string
  sortDirection:        'asc' | 'desc'
  onPageChange:         (page: number) => void
  onSortChange:         (col: string, dir: 'asc' | 'desc') => void
  onEdit?:               (id: string) => void
  onView?:               (id: string) => void
  onArchive?:           (id: string, setRefreshTable?: (refresh: boolean) =>void) => void
  setRefreshTable?:     (refresh: boolean) =>void
  onSearchChange?:      (value: any) => void
}

const statusStyle: Record<string, string> = {
    PAID:       'bg-green-200 text-green-600 border-green-300',
    PARTIAL:    'text-blue-600 bg-blue-200 border-blue-300',
    LATE:       'bg-yellow-200 text-yellow-600 border-yellow-300',
    PENDING:    'bg-gray-200 text-gray-600 border-gray-300',
}

const getTypeStyle = (type: string) => {
  if (type === 'RENT') return 'bg-green-200 text-green-600 border-green-300'
  return 'text-blue-600 bg-blue-200 border-blue-300'
}

export const PaymentDatatable = ({
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

    const columns: Column<Payment>[] = [
        {
        title:  '#',
        key:    'row_number',
        sortable: false,
        },
        {
            title:'Amount', key: 'amount', sortable: false,
        },
        {
            title:    'Type',
            key:      'type',
            sortable: false,
            render:   (item) => {
                return (
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider
                        ${getTypeStyle(item.type) ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        {item.type}
                    </span>
                )
            }
        },
        {
            title:'Notes', key: 'notes', sortable: false,
            render:(item)=>{
                return (item.notes??'—')
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
            title:'Due Date', key: 'formatted_due_date', sortable: false,
            render:(item)=>(
                item.formatted_due_date!=''?item.formatted_due_date:'—'
            )
        },
        {
            title:'Paid At', key: 'formatted_paid_at', sortable: false,
            render:(item)=>(
                item.formatted_paid_at!=''?item.formatted_paid_at:'—'
            )
        },
        {
            title: 'Action',key: 'id',
            render: (item) => (
                <div className="flex items-center gap-2">
                    {onView && item.status === 'PAID' && (
                        <Button
                            onClick={() => onView(item.id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600
                                bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                            View Payment
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <DataTableHandler<Payment>
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
