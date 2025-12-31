import type { PropsWithChildren, ElementType } from "react";

interface CardTitleProps {
  tag?: ElementType;
  className?: string;
}

export const CardTitle = ({
  tag: Tag = "h3",
  className = "",
  children,
}: PropsWithChildren<CardTitleProps>) => {
  return (
    <Tag className={`text-lg font-semibold ${className}`}>
      {children}
    </Tag>
  );
};

CardTitle.displayName = "CardTitle";
