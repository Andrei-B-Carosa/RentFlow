import { useState, useRef, useEffect } from 'react'
import ReactSelect, { components } from 'react-select'
import { apiClient } from '../../../api/axios'
import { selectStyles } from '../../../utils/selectStyle'

interface TenantOption {
    value: string
    label: string
    data: {
        name:  string
        email: string
    }
}

interface Props {
    value?:       string | null
    onChange:     (value: string, data?: any) => void
    onBlur?:      () => void
    error?:       string
    touched?:     boolean
    label?:       string
    placeholder?: string
    disabled?:    boolean
}

// custom option renderer
const TenantOption = (props: any) => (
    <components.Option {...props}>
        <div className="py-0.5">
            <p className="text-sm font-bold text-gray-800">
                {props.data.data.name}
            </p>
            <p className="text-xs text-gray-400">
                {props.data.data.email}
            </p>
        </div>
    </components.Option>
)

const TenantSelect = ({value,onChange,onBlur,error,touched,label='Tenant',placeholder='Search tenant by name or email...',disabled=false,}: Props) => {

    const [options, setOptions]               = useState<TenantOption[]>([])
    const [selectedOption, setSelectedOption] = useState<TenantOption | null>(null) // ← add this
    const [loading, setLoading]               = useState(false)
    const debounceRef                         = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!value) setSelectedOption(null)
    }, [value])

    const handleInputChange = (inputValue: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (!inputValue || inputValue.length < 2) {
            setOptions([])
            return
        }
        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const res  = await apiClient.get('/landlord/select/get-tenants', {
                    params: { search: inputValue }
                })
                const data = res.data?.data ?? []
                setOptions(
                    data.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                        data:  item,
                    }))
                )
            } catch {
                setOptions([])
            } finally {
                setLoading(false)
            }
        }, 400)
    }

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <ReactSelect<TenantOption>
                options={options}
                isLoading={loading}
                isDisabled={disabled}
                placeholder={placeholder}
                value={selectedOption}          // ← use state instead of derived value
                onChange={(selected) => {
                    setSelectedOption(selected) // ← save selected to state
                    onChange(selected?.value ?? '', selected?.data)
                }}
                onBlur={onBlur}
                onInputChange={handleInputChange}
                filterOption={() => true}
                components={{ Option: TenantOption }}
                styles={selectStyles<TenantOption>(!!touched && !!error)}
                noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2
                        ? 'Type at least 2 characters to search'
                        : 'No tenants found'
                }
            />
            {touched && error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}

export default TenantSelect