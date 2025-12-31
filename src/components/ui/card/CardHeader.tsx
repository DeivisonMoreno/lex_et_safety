import clsx from "clsx";
import type { ReactNode, ElementType } from "react";
import { borders, colors } from "./helpers";

interface CardHeaderProps {
    tag?: ElementType;
    className?: string;
    size?: "sm" | "md" | "lg";
    borderSize?: keyof typeof borders;
    borderColor?: keyof typeof colors;
    children?: ReactNode;
}

export const CardHeader = ({
    tag: Tag = "div",
    className = "",
    size = "md",
    borderSize = 0,
    borderColor = "light",
    children,
}: CardHeaderProps) => {
    return (
        <Tag
            className={clsx(
                "flex justify-between items-center",
                size === "sm" && "py-2 px-3",
                size === "md" && "py-3 px-4",
                size === "lg" && "py-4 px-5",
                borders[borderSize],
                borderColor && `border-${colors[borderColor]}`,
                className
            )}
        >
            {children}
        </Tag>
    );
};

CardHeader.displayName = "CardHeader";
