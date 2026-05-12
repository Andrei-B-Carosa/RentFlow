// utils/selectStyles.ts
import type { StylesConfig, GroupBase } from 'react-select'

export const selectStyles = <T extends object>(
    hasError: boolean
): StylesConfig<T, false, GroupBase<T>> => ({
    control: (base, state) => ({
        ...base,
        borderColor:     hasError
            ? '#f87171'
            : state.isFocused ? '#3b82f6' : '#d1d5db',
        backgroundColor: hasError ? '#fef2f2' : 'white',
        boxShadow:       state.isFocused
            ? hasError ? '0 0 0 2px #fca5a5' : '0 0 0 2px #93c5fd'
            : 'none',
        borderRadius:    '0.5rem',
        fontSize:        '0.875rem',
        minHeight:       '42px',
        '&:hover': {
            borderColor: hasError ? '#f87171' : '#3b82f6'
        },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#2563eb'
            : state.isFocused ? '#eff6ff' : 'white',
        color:           state.isSelected ? 'white' : '#111827',
        fontSize:        '0.875rem',
        cursor:          'pointer',
    }),
    placeholder: (base) => ({
        ...base,
        color:    '#9ca3af',
        fontSize: '0.875rem',
    }),
    singleValue: (base) => ({
        ...base,
        color:    '#111827',
        fontSize: '0.875rem',
    }),
    loadingMessage: (base) => ({
        ...base,
        fontSize: '0.875rem',
        color:    '#6b7280',
    }),
    noOptionsMessage: (base) => ({
        ...base,
        fontSize: '0.875rem',
        color:    '#6b7280',
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '0.5rem',
        border:       '1px solid #e5e7eb',
        boxShadow:    '0 4px 6px -1px rgba(0,0,0,0.1)',
        zIndex:       9999,
    }),
})