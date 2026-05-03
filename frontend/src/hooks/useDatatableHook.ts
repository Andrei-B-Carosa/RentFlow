import { useState, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import { useDataTable } from '../components/common/datatable/DatatableProvider'
import { apiClient } from '../api/axios'

interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
}

export const useTableHook = <Model>(
    url:          string,
    tableId:      string | null = null,
    extra_filter: Record<string, any> | false = false
) => {

    const { tables }  = useDataTable()
    const tableState  = tableId ? tables[tableId] : null

    // Data state
    const [data, setData]       = useState<Model[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState<string | null>(null)

    // Pagination state
    const [pagination, setPagination] = useState({
        total:        0,
        per_page:     10,
        current_page: 1,
        last_page:    1,
    })

    // Sort + page state
    const [page, setPage]                   = useState(1)
    const [sortColumn, setSortColumn]       = useState('id')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // Search state
    const [search, _setSearch] = useState('')
    const searchRef            = useRef('')

    // Refresh state
    const [refreshTable, setRefreshTable] = useState(false)

    // Refs to always have latest values in debouncedFetch
    const pageRef          = useRef(page)
    const sortColumnRef    = useRef(sortColumn)
    const sortDirectionRef = useRef(sortDirection)
    const perPageRef       = useRef(pagination.per_page)
    const extraFilterRef   = useRef(extra_filter)

    // Keep refs in sync
    useEffect(() => { pageRef.current          = page },               [page])
    useEffect(() => { sortColumnRef.current    = sortColumn },         [sortColumn])
    useEffect(() => { sortDirectionRef.current = sortDirection },      [sortDirection])
    useEffect(() => { perPageRef.current       = pagination.per_page },[pagination.per_page])
    useEffect(() => { extraFilterRef.current   = extra_filter },       [extra_filter])

    const fetchTable = async () => {
        if (!url) return
        if (extraFilterRef.current !== false && !extraFilterRef.current) return

        setLoading(true)
        setError(null)

        try {
            const response = await apiClient.get<PaginatedResponse<Model>>(url, {
                params: {
                    page:          pageRef.current,
                    sortColumn:    sortColumnRef.current,
                    sortDirection: sortDirectionRef.current,
                    pageSize:      perPageRef.current ?? 10,
                    search:        searchRef.current,
                    ...(extraFilterRef.current !== false
                        ? { extra_filter: extraFilterRef.current }
                        : {}),
                },
            })

            setData(response.data.data)
            setPagination(response.data.pagination)

        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    // Debounced version — safe because fetchTable uses refs
    const debouncedFetch = useRef(
        debounce(fetchTable, 500)
    ).current

    // Re-fetch on page, sort, refresh, globalRefresh, extra_filter change
    useEffect(() => {
        fetchTable()
        if (refreshTable) setRefreshTable(false)
    }, [page, sortColumn, sortDirection, refreshTable, tableState?.refreshKey, extra_filter])

    const setSearch = (value: string) => {
        _setSearch(value)
        searchRef.current = value
        setPage(1)
        debouncedFetch()
    }

    return {
        data,
        loading,
        error,
        page,
        sortColumn,
        sortDirection,
        pagination,
        search,
        setPage,
        setSortColumn,
        setSortDirection,
        setSearch,
        refreshTable,
        setRefreshTable,
    }
}