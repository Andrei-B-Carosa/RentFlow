
interface Props {
    name:string;
    value:string;
    placeholder:string;
    rows:number;
    className?:string;
    onChange?:     (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?:       (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    label?:string;
    error?:string;
    touched?:boolean;
}

const TextArea = ({name,value="",placeholder,rows=3,className,label,onChange,onBlur, error, touched}:Props) => {

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {/* <span className="text-gray-400 font-normal"> (optional)</span> */}
                </label>
            )}
            <textarea
                name={name}
                value={value}
                placeholder={placeholder}
                rows={rows}
                onChange={onChange}
                onBlur={onBlur}
                className={`px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full`}

            />
            {touched && error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

export default TextArea;