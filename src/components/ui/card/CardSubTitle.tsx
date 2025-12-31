import type { ReactNode, ElementType } from "react";

interface CardSubTitleProps {
    tag?: ElementType;
    className?: string;
    children?: ReactNode;
}

export const CardSubTitle = ({
    tag: Tag = "p",
    className = "",
    children,
}: CardSubTitleProps) => {
    return (
        <Tag className={`text-sm text-gray-500 ${className}`}>
            {children}
        </Tag>
    );
};

CardSubTitle.displayName = "CardSubTitle";
