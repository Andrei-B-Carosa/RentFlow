import { useEffect } from 'react'
import ReactSelect, { components } from 'react-select'
import { useSelectHook } from '../../../hooks/useSelectHook'
import { selectStyles } from '../../../utils/selectStyle'

interface UnitOption {
    value:       string
    label:       string
    data: {
        unit_number: string
        rent_price:  number
        status:      string
        property:    { name: string }
    }
}

interface Props {
    propertyId:  string | undefined    // scope units to this property
    value?:      string | null
    onChange:    (value: string, data?: any) => void
    onBlur?:     () => void
    error?:      string
    touched?:    boolean
    label?:      string
    placeholder?: string
    disabled?:   boolean
}

// custom option renderer
const UnitOption = (props: any) => {
    const { data } = props
    const statusColor: Record<string, string> = {
        VACANT:            'text-green-600 bg-green-50',
        OCCUPIED:          'text-red-500 bg-red-50',
        UNDER_MAINTENANCE: 'text-amber-600 bg-amber-50',
    }
    return (
        <components.Option {...props}>
            <div className="flex items-center justify-between py-0.5">
                <div>
                    <p className="text-sm font-bold text-gray-800">
                        {data.data.unit_number}
                    </p>
                    <p className="text-xs text-gray-400">
                        {data.data.property?.name}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-700">
                        ₱{Number(data.data.rent_price).toLocaleString()}/mo
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                        ${statusColor[data.data.status] ?? 'text-gray-500 bg-gray-50'}`}>
                        {data.data.status.replace('_', ' ')}
                    </span>
                </div>
            </div>
        </components.Option>
    )
}

const UnitSelect = ({propertyId,value,onChange,onBlur,error,touched,label='Unit',placeholder='Select a unit...',disabled=false,}: Props) => {

    const { options, loading, fetchOptions } = useSelectHook<UnitOption>()

    useEffect(() => {
        if (!propertyId) return
        fetchOptions(
            `landlord/select/${propertyId}/get-units`,
            (item:any) => ({
                value: item.id,
                label: item.unit_number,
                data:  item,
            }),
            { status: 'VACANT' }   // only show vacant units
        )
    }, [propertyId])

    const selectedOption = options.find((o:any) => o.value === value) ?? null

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <ReactSelect
                options={options}
                isLoading={loading}
                isDisabled={disabled || !propertyId}
                placeholder={!propertyId ? 'Select a property first...' : placeholder}
                value={selectedOption}
                onChange={(selected:any) => {
                    onChange(selected?.value ?? '', selected?.data)
                }}
                onBlur={onBlur}
                components={{ Option: UnitOption }}
                styles={selectStyles<UnitOption>(!!touched && !!error)}
                noOptionsMessage={() =>
                    !propertyId ? 'Select a property first' : 'No vacant units found'
                }
            />
            {touched && error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}

export default UnitSelect