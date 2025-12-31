import React, { useState } from "react";
import type { ReactNode, ElementType } from "react";
import clsx from "clsx";
import { borders, colors, shadows } from "./helpers";

interface CardProps {
    tag?: ElementType;
    className?: string;
    shadow?: keyof typeof shadows;
    borderSize?: keyof typeof borders;
    borderColor?: keyof typeof colors;
    stretch?: boolean | "semi";
    hasTab?: boolean;
    tabButtonColor?: keyof typeof colors;
    tabBodyClassName?: string;
    children: ReactNode;
}

const Card: React.FC<CardProps> = ({
    tag: Tag = "div",
    className = "",
    shadow = "md",
    borderSize = 0,
    borderColor = "light",
    stretch = false,
    hasTab = false,
    tabButtonColor = "primary",
    tabBodyClassName = "",
    children,
}) => {

    const [activeTab, setActiveTab] = useState<string | null>(null);

    return (
        <Tag
            className={clsx(
                "rounded-lg bg-white overflow-hidden",
                shadows[shadow],
                borders[borderSize],
                borderColor && `border-${colors[borderColor]}`,
                stretch === true ? "w-full h-full max-h-full" : "",
                stretch === "semi" ? "w-full" : "",
                className
            )}
        >
            {/* Render children normally */}
            {!hasTab && children}

            {/* Tabs */}
            {hasTab && (
                <div className="flex flex-col">
                    {/* tab titles */}
                    <div className="flex border-b bg-gray-50 px-2">
                        {React.Children.map(children, (child: any) =>
                            child.type.displayName === "CardTabItem" ? (
                                <button
                                    onClick={() => setActiveTab(child.props.id)}
                                    className={clsx(
                                        "px-4 py-2 text-sm font-medium",
                                        activeTab === child.props.id
                                            ? `text-${colors[tabButtonColor]} border-b-2 border-${colors[tabButtonColor]}`
                                            : "text-gray-600"
                                    )}
                                >
                                    {child.props.icon && <child.props.icon className="w-4 h-4 mr-1 inline" />}
                                    {child.props.title}
                                </button>
                            ) : null
                        )}
                    </div>

                    {/* tab body */}
                    <div className={clsx("p-4", tabBodyClassName)}>
                        {React.Children.map(children, (child: any) =>
                            child.type.displayName === "CardTabItem" && child.props.id === activeTab
                                ? child
                                : null
                        )}
                    </div>
                </div>
            )}
        </Tag>
    );
};

export default Card;
