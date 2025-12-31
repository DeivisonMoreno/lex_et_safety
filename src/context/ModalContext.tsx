// src/context/ModalContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


type ModalState = {
    [id: string]: boolean;
};

type ModalContextType = {
    modals: ModalState;
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modals, setModals] = useState<ModalState>({});

    const openModal = (id: string) => setModals((prev) => ({ ...prev, [id]: true }));
    const closeModal = (id: string) => setModals((prev) => ({ ...prev, [id]: false }));

    return (
        <ModalContext.Provider value={{ modals, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal debe usarse dentro de un ModalProvider");
    return context;
}
