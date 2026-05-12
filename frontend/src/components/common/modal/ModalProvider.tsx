import React, { createContext, useContext, useState } from 'react'
import ModalHandler from './ModalHandler'

interface ModalProps {
    title:      string
    body:       React.ReactNode
    modalClass?: string
    size?:      'sm' | 'md' | 'lg' | 'xl'
    loading?:   boolean
}

interface ModalContextProps {
    showModal:  (props: ModalProps) => void
    closeModal: () => void
    modalState: ModalProps | null
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used within ModalProvider')
    return context
}

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalStack, setModalStack] = useState<ModalProps[]>([])

    const showModal = (props: ModalProps) => {
        setModalStack(prev => [...prev, props])  // push to stack
    }

    const closeModal = () => {
        setModalStack(prev => prev.slice(0, -1)) // pop from stack
    }

    return (
        <ModalContext.Provider value={{ showModal, closeModal, modalState: modalStack[modalStack.length - 1] ?? null }}>
            {children}
            {modalStack.map((modal, index) => (
                <ModalHandler
                    key={index}
                    title={modal.title}
                    body={modal.body}
                    size={modal.size}
                    loading={modal.loading}
                    onClose={closeModal}
                    zIndex={40 + index * 10}  // each modal higher z-index
                />
            ))}
        </ModalContext.Provider>
    )
}