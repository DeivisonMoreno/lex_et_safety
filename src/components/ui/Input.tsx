import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
}

const neuShadow =
    "shadow-[inset_4px_4px_10px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_rgba(255,255,255,0.7)]";

const Input: React.FC<InputProps> = ({
    label,
    className = "",
    required,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm text-[#334155] font-medium">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <input
                className={`px-4 py-2 rounded-xl bg-[#E8ECF2] text-[#1E293B] 
          focus:outline-none focus:ring-2 focus:ring-blue-500 ${neuShadow} ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;
