import type { ReactNode, ElementType } from "react";
import clsx from "clsx";
import { colors } from "../card/helpers";

interface AccordionItemProps {
    id: string;
    title: string;
    icon?: ReactNode;
    tag?: ElementType;
    headerTag?: ElementType;
    overWriteColor?: keyof typeof colors;
    children?: ReactNode;
}

export const AccordionItem = ({
    id,
    title,
    icon,
    tag: Tag = "div",
    headerTag: HeaderTag = "h3",
    overWriteColor,
    children,
}: AccordionItemProps) => {
    return (
        <Tag className="border-b last:border-none">
            <HeaderTag
                className={clsx(
                    "flex items-center justify-between cursor-pointer px-4 py-3 select-none",
                    overWriteColor && `text-${colors[overWriteColor]}`
                )}
                data-accordion-header={id}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="h-5 w-5">{icon}</span>}
                    <span className="font-medium">{title}</span>
                </div>

                <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M6 9l6 6 6-6"
                    />
                </svg>
            </HeaderTag>
            <div
                className="px-4 py-3 hidden"
                data-accordion-body={id}
            >
                {children}
            </div>
        </Tag>
    );
};

AccordionItem.displayName = "AccordionItem";
