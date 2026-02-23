import React, { useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/* =======================
   TYPES
======================= */

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    required?: boolean;
    error?: string;
    placeholder?: string;

    /** Ordenar opciones automáticamente */
    sort?: boolean;

    /** Campo por el cual ordenar */
    sortBy?: "label" | "value";

    /** Locale para localeCompare */
    locale?: string;
}

/* =======================
   STYLES
======================= */

const neuShadow =
    "shadow-[inset_4px_4px_10px_rgba(0,0,0,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.85)]";

/* =======================
   COMPONENT
======================= */

const Select: React.FC<SelectProps> = ({
    label,
    options,
    required,
    error,
    placeholder = "Seleccione una opción",
    className = "",
    disabled,

    sort = true,
    sortBy = "label",
    locale = "es",

    ...props
}) => {
    const sortedOptions = useMemo(() => {
        if (!sort) return options;

        return [...options].sort((a, b) =>
            String(a[sortBy]).localeCompare(
                String(b[sortBy]),
                locale,
                { sensitivity: "base" }
            )
        );
    }, [options, sort, sortBy, locale]);

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-medium text-slate-600">
                    {label}
                    {required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>
            )}

            <div className="relative">
                <select
                    disabled={disabled}
                    className={`
                        w-full appearance-none rounded-xl px-4 py-2 pr-10 text-sm
                        bg-[#E8ECF2] text-slate-800
                        ${neuShadow}
                        transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? "ring-2 ring-red-400" : ""}
                        ${className}
                    `}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {sortedOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <ChevronDownIcon
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
            </div>

            {error && (
                <span className="text-[11px] text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;
