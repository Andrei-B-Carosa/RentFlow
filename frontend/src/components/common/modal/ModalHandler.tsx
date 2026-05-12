import { useEffect } from 'react'
import React from 'react'

export interface ModalProps {
    title:       string
    body:        React.ReactNode
    modalClass?: string
    size?:       'sm' | 'md' | 'lg' | 'xl'
    loading?:    boolean
    onClose:     () => void
    zIndex?: number
}

const sizeStyles = {
    sm:  'max-w-sm',
    md:  'max-w-md',
    lg:  'max-w-lg',
    xl:  'max-w-2xl',
}

export function ModalHandler({
    title,
    body,
    modalClass = '',
    size       = 'md',
    loading    = false,
    onClose,
    zIndex
}: ModalProps) {

    // prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    // close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                style={{ zIndex: zIndex ?? 40 }}
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ zIndex: zIndex ?? 40 }}>
                <div
                    className={`
                        bg-white rounded-2xl shadow-xl w-full
                        ${sizeStyles[size ?? 'md']}
                        ${modalClass}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                                hover:bg-gray-100 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <svg className="animate-spin h-6 w-6 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                            </div>
                        ) : body}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalHandler