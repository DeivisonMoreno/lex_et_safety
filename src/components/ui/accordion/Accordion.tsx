import React, { useState, Children, cloneElement } from "react";
import type { ReactElement, ReactNode, ElementType } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// ---- Types ----
export type TColor =
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "light"
    | "dark";

type TActiveItemId = string | number | boolean | null;

// ---- Helpers ----
const colorMap: Record<TColor, string> = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    info: "text-cyan-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    light: "text-gray-200",
    dark: "text-gray-900",
};

// ---- Accordion Item ----
interface AccordionItemProps {
    id: string | number;
    title: string;
    children: ReactNode;
    icon?: ElementType;
    tag?: ElementType;
    headerTag?: ElementType;
    overWriteColor?: TColor | null;
    parentId?: string | number | null;
    activeItem?: TActiveItemId;
    center?: Boolean;
    setActiveItem?: (v: TActiveItemId) => void;
}

export const AccordionItem = ({
    id,
    title,
    children,
    tag: Tag = "div",
    headerTag: HeaderTag = "h3",
    icon: Icon,
    overWriteColor,
    activeItem,
    center,
    setActiveItem,
}: AccordionItemProps) => {
    const ACTIVE = activeItem === id;
    const color = overWriteColor ? colorMap[overWriteColor] : "text-blue-600";

    return (
        <Tag className="border-b border-gray-200 w-full">
            <HeaderTag className="w-full">
                <button
                    type="button"
                    className={clsx(
                        "relative flex items-center w-full px-3 py-2 transition-colors cursor-pointer",
                        ACTIVE ? "bg-gray-100" : "hover:bg-gray-50",
                        center && "justify-center"
                    )}
                    onClick={() => (ACTIVE ? setActiveItem?.(null) : setActiveItem?.(id))}
                >
                    <div className="flex items-center gap-2">
                        {Icon && (
                            <Icon className={clsx("w-4 h-4", color)} />
                        )}

                        <span className="text-[13px] font-semibold text-gray-800 tracking-tight">
                            {title}
                        </span>
                    </div>

                    <ChevronDownIcon
                        className={clsx(
                            "absolute right-4 w-4 h-4 transition-transform duration-300",
                            color,
                            ACTIVE && "rotate-180"
                        )}
                    />
                </button>
            </HeaderTag>

            <div
                className={clsx(
                    "overflow-hidden transition-all duration-300",
                    ACTIVE ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-3 pt-2 pb-3 text-[12px] text-gray-700 overflow-x-auto">
                    {children}
                </div>
            </div>
        </Tag>
    );
};
AccordionItem.displayName = "AccordionItem";

// ---- Accordion ----
interface AccordionProps {
    tag?: "div" | "section";
    id: string | number;
    activeItemId?: TActiveItemId;
    children: ReactElement<AccordionItemProps> | ReactElement<AccordionItemProps>[];
    shadow?: "none" | "sm" | "default" | "lg";
    color?: TColor;
    isFlush?: boolean;
    className?: string;
}

export const Accordion = ({
    tag: Tag = "div",
    id,
    activeItemId,
    children,
    shadow = "default",
    color = "primary",
    isFlush = false,
    className = "",
}: AccordionProps) => {
    const [activeItem, setActiveItem] = useState<TActiveItemId>(
        activeItemId === false ? null : activeItemId || (Array.isArray(children) && children[0]?.props.id)
    );

    const shadowClass = {
        none: "shadow-none",
        sm: "shadow-sm",
        default: "shadow",
        lg: "shadow-lg",
    }[shadow];

    return (
        <Tag
            id={String(id)}
            className={clsx(
                "w-full rounded-md border border-gray-200 overflow-hidden",
                !isFlush && shadowClass,
                className
            )}
        >
            {Children.map(children, (child) => {
                if (!React.isValidElement(child)) return null;

                const Component = child.type as { displayName?: string };

                if (Component.displayName === "AccordionItem") {
                    return cloneElement(child, {
                        activeItem,
                        setActiveItem,
                        parentId: id,
                        overWriteColor: child.props.overWriteColor || color,
                    });
                }

                return null;
            })}
        </Tag>
    );
};

Accordion.displayName = "Accordion";
