// src/components/Modal.tsx
import { Dialog, Transition } from "@headlessui/react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { useModal } from "../../context/ModalContext";
import clsx from 'clsx';


type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
type ModalPosition = "center" | "top" | "bottom" | "right";

const sizeClasses: Record<ModalSize, string> = {
  sm: `
    w-full
    max-w-md
    max-h-[70vh]
  `,
  md: `
    w-full
    max-w-xl
    max-h-[80vh]
  `,
  lg: `
    w-full
    max-w-[92vw]
    lg:max-w-4xl
    max-h-[90vh]
  `,
  xl: `
    w-full
    max-w-[95vw]
    xl:max-w-6xl
    max-h-[95vh]
  `,
  full: `
    w-screen
    h-screen
    max-w-none
    max-h-none
    rounded-none
  `,
};


const positionClasses: Record<ModalPosition, string> = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-10",
  bottom: "items-end justify-center pb-10",
  right: "items-center justify-end pr-4",
};

type ModalProps = {
  id: string;
  children: ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
};


export function Modal({
  id,
  children,
  size = "md",
  position = "center",
}: ModalProps) {
  const { modals, closeModal } = useModal();
  const isOpen = modals[id] ?? false;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={() => closeModal(id)}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        {/* Container */}
        <div
          className={clsx(
            "fixed inset-0 flex",
            size !== "full" && "p-4",
            positionClasses[position]
          )}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={clsx(
                "bg-white shadow-lg flex flex-col overflow-hidden",
                size !== "full" && "rounded-xl",
                sizeClasses[size]
              )}
            >
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}