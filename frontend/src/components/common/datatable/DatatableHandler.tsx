import React, { useState, useRef } from 'react'

export interface Column<T> {
    title:     string
    key:       keyof T | string
    render?:   (row: T) => React.ReactNode
    sortable?: boolean
}

export interface DataTableProps<T> {
    data:            T[]
    columns:         Column<T>[]
    pagination?: {
        total?:        number
        per_page?:     number
        current_page?: number
        last_page?:    number
    }
    loading?:        boolean
    onPageChange?:   (page: number) => void
    onSortChange?:   (column: string, direction: 'asc' | 'desc') => void
    sortColumn?:     string
    sortDirection?:  'asc' | 'desc'
    onSearchChange?: (query: string) => void
    search?:         string
    cardTitle?:      string
    cardSubTitle?:   string
    scrollHeight?:   string
}

export function DataTableHandler<T>({
    data           = [],
    columns        = [],
    pagination,
    loading        = false,
    onPageChange,
    onSortChange,
    sortColumn,
    sortDirection,
    onSearchChange,
    cardTitle      = '',
    cardSubTitle   = '',
    scrollHeight,
}: DataTableProps<T>) {
    const [search, setSearch]   = useState('')
    const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleSort = (colKey: string) => {
        if (!onSortChange) return
        const newDirection = sortColumn === colKey && sortDirection === 'asc' ? 'desc' : 'asc'
        onSortChange(colKey, newDirection)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearch(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            onSearchChange?.(value)
        }, 500)
    }

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= (pagination?.last_page || 1)) {
            onPageChange?.(page)
        }
    }

    return (
        <div className="bg-white shadow-sm rounded-xl mb-5">

            {/* Header */}
            { (cardTitle || onSearchChange) && (<div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">

                <div>
                    {cardTitle && (
                        <h3 className="text-base font-semibold text-gray-800">{cardTitle}</h3>
                    )}
                    {cardSubTitle && (
                        <p className="text-sm text-gray-400 mt-0.5">{cardSubTitle}</p>
                    )}
                </div>
                
                {/* Search */}
                {onSearchChange && (
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search..."
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-56"
                    />
                )}
            </div>)
            }

            {/* Table */}
            <div
                className="overflow-x-auto"
                style={scrollHeight ? { maxHeight: scrollHeight, overflowY: 'auto' } : {}}
            >
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    onClick={() => col.sortable && handleSort(col.key.toString())}
                                    className={`px-6 py-3 font-semibold whitespace-nowrap
                                        ${col.sortable ? 'cursor-pointer hover:text-gray-600 select-none' : ''}`}
                                >
                                    <span className="flex items-center gap-1">
                                        {col.title}
                                        {col.sortable && (
                                            <span className="text-gray-300">
                                                {sortColumn === col.key.toString()
                                                    ? sortDirection === 'asc' ? '▲' : '▼'
                                                    : '⇅'}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        <span className="text-sm">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M9 17v-6h13M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v3"/>
                                        </svg>
                                        <span className="text-sm font-medium">No records found</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-6 py-4 text-gray-700">
                                            {col.render
                                                ? col.render(row)
                                                : (row as any)[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
                    <span className="text-sm text-gray-400">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>

                    <div className="flex gap-1">
                        {/* Prev */}
                        <button
                            onClick={() => handlePageClick((pagination.current_page ?? 1) - 1)}
                            disabled={pagination.current_page === 1}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                                hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ←
                        </button>

                        {/* Page numbers */}
                        {[...Array(pagination.last_page)].map((_, index) => {
                            const page = index + 1
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`px-3 py-1.5 text-sm border rounded-lg transition
                                        ${pagination.current_page === page
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        })}

                        {/* Next */}
                        <button
                            onClick={() => handlePageClick((pagination.current_page ?? 1) + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                                hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}