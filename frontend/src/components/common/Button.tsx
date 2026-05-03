type ButtonProps = {
    type?:        'submit' | 'button' | 'reset';
    loading?:     boolean;
    disabled?:    boolean;
    onClick?:     () => void;
    children:     React.ReactNode;
    className?:   string;
    loadingText?: string;
    variant?:     'primary' | 'danger' | 'outline';
};

const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
};

const Button = ({
    type        = 'button',
    loading     = false,
    disabled    = false,
    onClick,
    children,
    className   = '',
    loadingText = 'Loading...',
    variant     = 'primary',
}: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                py-2.5 px-4 text-sm font-medium rounded-lg transition
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${className}
            `}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {loadingText}
                </span>
            ) : children}
        </button>
    );
};

export default Button;