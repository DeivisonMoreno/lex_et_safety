import type { ReactNode } from "react";

interface CardActionsProps {
    className?: string;
    children?: ReactNode;
}

export const CardActions = ({
    className = "",
    children,
}: CardActionsProps) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            {children}
        </div>
    );
};

CardActions.displayName = "CardActions";
