import type { ReactNode } from "react";
import { Dialog } from "@headlessui/react";

export function ModalHeader({ children }: { children: ReactNode }) {
    return (
        <Dialog.Title className="px-5 py-4 border-b text-lg font-semibold">
            {children}
        </Dialog.Title>
    );
}

export function ModalBody({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {children}
        </div>
    );
}

export function ModalFooter({ children }: { children: ReactNode }) {
    return (
        <div className="px-5 py-3 border-t flex justify-end gap-2">
            {children}
        </div>
    );
}

export function ModalActions({ children }: { children: ReactNode }) {
    return <div className="flex gap-2">{children}</div>;
}

