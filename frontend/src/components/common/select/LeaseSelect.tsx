import { useEffect } from 'react'
import ReactSelect, { type SingleValue, components } from 'react-select'
import { useSelectHook } from '../../../hooks/useSelectHook'
import { selectStyles } from '../../../utils/selectStyle'

interface LeaseOption {
    value: string
    label: string
    data: {
        id:string
        monthly_rent: number
        unit: { 
            unit_number: string 
        }
        tenant: {
            name:  string
            email: string
        }
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

const LeaseOptionComponent = (props: any) => (
    <components.Option {...props}>
        <div className="flex items-center justify-between py-0.5">
            <div>
                <p className="text-sm font-bold text-gray-800">
                    {props.data.data.unit?.unit_number ?? '—'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center
                        justify-center text-white text-[8px] font-bold flex-shrink-0">
                        {props.data.data.tenant?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <p className="text-xs text-gray-400">
                        {props.data.data.tenant?.name ?? '—'}
                    </p>
                </div>
            </div>
            <span className="text-xs font-bold text-gray-700 flex-shrink-0">
                ₱{Number(props.data.data.monthly_rent).toLocaleString('en-PH')}/mo
            </span>
        </div>
    </components.Option>
)

const LeaseSelect = ({
    value,
    onChange,
    onBlur,
    error,
    touched,
    label       = 'Lease',
    placeholder = 'Select a lease...',
    disabled    = false,
}: Props) => {

    const { options, loading, fetchOptions } = useSelectHook<LeaseOption>()

    useEffect(() => {
        fetchOptions(
            '/landlord/select/get-leases',
            (item) => ({
                value: item.id,
                label: `${item.unit?.unit_number} — ${item.tenant?.name}`,
                data:  item,
            })
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
            <ReactSelect<LeaseOption>
                options={options}
                isLoading={loading}
                isDisabled={disabled}
                placeholder={placeholder}
                value={selectedOption}
                onChange={(selected: SingleValue<LeaseOption>) => {
                    onChange(selected?.value ?? '', selected?.data)
                }}
                onBlur={onBlur}
                components={{ Option: LeaseOptionComponent }}
                styles={selectStyles<LeaseOption>(!!touched && !!error)}
                noOptionsMessage={() => 'No active leases found'}
            />
            {touched && error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}

export default LeaseSelect