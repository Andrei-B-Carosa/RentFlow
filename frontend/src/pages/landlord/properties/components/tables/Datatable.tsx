import Button from "../../../../../components/common/Button";
import { DataTableHandler, type Column } from "../../../../../components/common/datatable/DatatableHandler";
import type { PropertyProps } from "../../core/types";

type Props = {
  data:                 PropertyProps[]
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

export const PropertyDatatable = ({
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

    const columns: Column<PropertyProps>[] = [
        {
            title:'#', key: 'row_number', sortable: true
        },
        {
            title:'Property', key: 'name', sortable: true,
            render:(item)=>(
                <div className="flex items-center gap-4">
                    <img
                        src={`${import.meta.env.VITE_STORAGE_URL}/${item.photos[0]}`}
                        alt={item.name}
                        className="w-12 h-12 rounded-sm object-cover flex-shrink-0"
                    />
                    <span className="font-semibold text-gray-900">
                        {item.name}
                    </span>
                </div>
            )
        },
        {
            title:'Address', key: 'name', sortable: false,
            render:(item)=>(
                <>
                    <span>{item.address+', '+item.city}</span>
                </>
            )
        },
        {
            title:'Description', key: 'description', sortable: false
        },
        {
            title:'Status', key:'is_active',sortable:false,
            render:(item)=>(
                <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                        item.is_active
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-red-50 text-red-500 border-red-100"
                    }`}
                >
                    {item.is_active ? "Active" : "Inactive"}
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
                            View Property
                        </Button>
                    )}
                    {onArchive && (
                        <Button
                            onClick={() => onArchive(item.id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600
                                bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                            Archive Property
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <DataTableHandler<PropertyProps>
                data={data}
                columns={columns}
                loading={loading}
                pagination={pagination}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onPageChange={onPageChange}
                onSortChange={onSortChange}
                onSearchChange={onSearchChange}
                // cardTitle="Properties"
                // cardSubTitle="Manage your rental properties"
            />
        </div>
    )

}
