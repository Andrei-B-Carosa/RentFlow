import axios from "axios";
import { useState, useEffect, useRef } from 'react'

type Props ={ 
    value:string
    onChange:(value:string)=>void
}

const RoleSelect = ({ value, onChange} :Props ) =>{
    const [roles,setRoles] = useState<string[]>([]);
    const [search,setSearch] = useState('');
    const [open,setOpen] = useState(false);
    const [loading, setLoading]= useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch roles from backend on mount
    useEffect(() => {
        axios.get('http://localhost:8000/api/roles')
        .then((res) => setRoles(res.data))
        .catch(() => setRoles([]))
        .finally(() => setLoading(false))
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])


    // Filter roles based on search input
    const filtered = roles.filter((r) =>
        r.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (role: string) => {
        onChange(role)   // send selected value up to SetupPage
        setSearch(role)  // show selected value in the input
        setOpen(false)
    }
    
    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                placeholder={loading ? 'Loading roles...' : 'Search job role...'}
                value={search}
                disabled={loading}
                onChange={(e) => {
                setSearch(e.target.value)
                onChange('')   // clear selected value while typing
                setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />

            {/* Dropdown list */}
            {open && !loading && (
                <ul className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-52 overflow-y-auto shadow-xl">
                {filtered.length > 0 ? (
                    filtered.map((role) => (
                    <li
                        key={role}
                        onClick={() => handleSelect(role)}
                        className="px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600 hover:text-white cursor-pointer"
                    >
                        {role}
                    </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-sm text-gray-500">No roles found</li>
                )}
                </ul>
            )}
        </div>
    )
}

export default RoleSelect;