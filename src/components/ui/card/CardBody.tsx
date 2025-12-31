import clsx from "clsx";
import type { ReactNode, ElementType } from "react";

interface CardBodyProps {
    tag?: ElementType;
    className?: string;
    children?: ReactNode;
}

export const CardBody = ({
    tag: Tag = "div",
    className = "",
    children,
}: CardBodyProps) => {
    return (
        <Tag className={clsx("p-4 ", className)}>
            {children}
        </Tag>
    );
};

CardBody.displayName = "CardBody";
