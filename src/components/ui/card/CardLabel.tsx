import type { ReactNode } from "react";

interface CardLabelProps {
    children?: ReactNode;
    className?: string;
}

export const CardLabel = ({ children, className = "" }: CardLabelProps) => (
    <div className={`flex flex-col ${className}`}>{children}</div>
);

CardLabel.displayName = "CardLabel";
