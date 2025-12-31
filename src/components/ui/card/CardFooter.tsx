import clsx from "clsx";
import type { ReactNode, ElementType } from "react";
import { borders, colors } from "./helpers";

interface CardFooterProps {
    tag?: ElementType;
    className?: string;
    size?: "sm" | "md" | "lg";
    borderSize?: 0 | 1 | 2 | 3 | 4 | 5;
    borderColor?: keyof typeof colors;
    children?: ReactNode;
}

export const CardFooter = ({
    tag: Tag = "div",
    className = "",
    size = "md",
    borderSize = 0,
    borderColor = "light",
    children,
}: CardFooterProps) => {
    return (
        <Tag
            className={clsx(
                "flex justify-between items-center",
                size === "sm" && "py-2 px-3",
                size === "lg" && "py-4 px-5",
                size === "md" && "py-3 px-4",
                borders[borderSize],
                borderColor && `border-${colors[borderColor]}`,
                className
            )}
        >
            {children}
        </Tag>
    );
};

CardFooter.displayName = "CardFooter";
