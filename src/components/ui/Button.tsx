import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { IconType } from "../types/IconType";

/* =======================
   Types
======================= */

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark";

type TypeStyle = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  typeStyle?: TypeStyle;
  size?: Size;
  leftIcon?: IconType;
  rightIcon?: IconType;
  children: React.ReactNode;
}

/* =======================
   Style maps
======================= */

const colorMap: Record<Variant, Record<TypeStyle, string>> = {
  primary: {
    solid: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    ghost: "text-indigo-600 hover:bg-indigo-50",
  },
  secondary: {
    solid: "bg-pink-400 text-white hover:bg-pink-500",
    outline: "border border-pink-400 text-pink-500 hover:bg-pink-50",
    ghost: "text-pink-500 hover:bg-pink-50",
  },
  success: {
    solid: "bg-emerald-500 text-white hover:bg-emerald-600",
    outline: "border border-emerald-500 text-emerald-600 hover:bg-emerald-50",
    ghost: "text-emerald-600 hover:bg-emerald-50",
  },
  info: {
    solid: "bg-sky-500 text-white hover:bg-sky-600",
    outline: "border border-sky-500 text-sky-600 hover:bg-sky-50",
    ghost: "text-sky-600 hover:bg-sky-50",
  },
  warning: {
    solid: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline: "border border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    ghost: "text-yellow-600 hover:bg-yellow-50",
  },
  danger: {
    solid: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-red-500 text-red-500 hover:bg-red-50",
    ghost: "text-red-500 hover:bg-red-50",
  },
  light: {
    solid: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-600 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
  },
  dark: {
    solid: "bg-gray-900 text-white hover:bg-black",
    outline: "border border-gray-900 text-gray-900 hover:bg-gray-200",
    ghost: "text-gray-900 hover:bg-gray-100",
  },
};

const sizeMap: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-xl",
};

/* =======================
   Component
======================= */

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  typeStyle = "solid",
  size = "md",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge(
        clsx(
          "inline-flex items-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
          colorMap[variant][typeStyle],
          sizeMap[size],
          className
        )
      )}
    >
      {LeftIcon && <LeftIcon className="h-5 w-5" />}
      {children}
      {RightIcon && <RightIcon className="h-5 w-5" />}
    </button>
  );
};

export default Button;
