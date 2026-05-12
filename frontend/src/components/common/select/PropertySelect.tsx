import { useEffect } from 'react'
import ReactSelect, { components } from 'react-select'
import { useSelectHook } from '../../../hooks/useSelectHook'
import { selectStyles } from '../../../utils/selectStyle'

interface PropertyOption {
    value: string
    label: string
    data: {
        name:       string
        address:    string
        city:       string
        units_count: number
        is_active:  boolean
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
const PropertyOption = (props: any) => (
    <components.Option {...props}>
        <div className="flex items-center justify-between py-0.5">
            <div>
                <p className="text-sm font-bold text-gray-800">
                    {props.data.data.name}
                </p>
                <p className="text-xs text-gray-400">
                    {props.data.data.address}, {props.data.data.city}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400">
                    {props.data.data.units_count} units
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                    ${props.data.data.is_active
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-500 bg-red-50'
                    }`}>
                    {props.data.data.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>
    </components.Option>
)

const PropertySelect = ({
    value,
    onChange,
    onBlur,
    error,
    touched,
    label       = 'Property',
    placeholder = 'Select a property...',
    disabled    = false,
}: Props) => {

    const { options, loading, fetchOptions } = useSelectHook<PropertyOption>()

    useEffect(() => {
        fetchOptions(
            'landlord/select/get-properties',
            (item:any) => ({
                value: item.id,
                label: item.name,
                data:  item,
            }),
            { pageSize: 100 }   // load all properties
        )
    }, [])

    const selectedOption = options.find(o => o.value === value) ?? null

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <ReactSelect<PropertyOption>
                options={options}
                isLoading={loading}
                isDisabled={disabled}
                placeholder={placeholder}
                value={selectedOption}
                onChange={(selected) => {
                    onChange(selected?.value ?? '', selected?.data)
                }}
                onBlur={onBlur}
                components={{ Option: PropertyOption }}
                styles={selectStyles<PropertyOption>(!!touched && !!error)}
                noOptionsMessage={() => 'No properties found'}
            />
            {touched && error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}

export default PropertySelect