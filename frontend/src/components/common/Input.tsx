type InputProps = {
    label?:       string;
    placeholder?: string;
    type:         'text' | 'email' | 'password' | 'number' | 'date' | 'file';
    value?:       string | number;
    className?:   string;
    name:         string;
    onChange?:     (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?:       (e: React.FocusEvent<HTMLInputElement>) => void;
    error?:       string;
    touched?:     boolean;
    disabled?:    boolean;
    multiple?:    boolean;
};

const Input = ({
    label,
    placeholder,
    type,
    value,
    name,
    className = '',
    onChange,
    onBlur,
    error,
    touched,
    disabled=false,
    multiple=false,
}: InputProps) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${touched && error
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 bg-white'
                    }`}
                disabled={disabled}
                multiple={multiple}
            />
            {touched && error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Input;