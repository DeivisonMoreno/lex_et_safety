import React, { useState } from "react";
import NavBar from "../../components/shared/Navbar";
import {
    CircleStackIcon,
    CloudArrowDownIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { API_URL } from "../../config/env";
import { authStorage } from "../../services/authStorage";

/* =======================
   TYPES
======================= */

type InformeType = {
    label: string;
    name: string;
    description: string;
};

const INFORMES: InformeType[] = [
    {
        label: "Base Procesal General",
        name: "base_procesal_general",
        description: "Contiene todos los procesos activos",
    },
    /* {
        label: "Base Total",
        name: "base_total",
        description: "Contiene la informacion de todos los procesos",
    }, */
];

/* =======================
   COMPONENT
======================= */

const BasesProcesales: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedInforme, setSelectedInforme] = useState<string | null>(null);

    /* =======================
       ACTION
    ======================= */

    const generarInforme = async (nombreInforme: string) => {
        try {
            setLoading(true);
            setError(false);
            setSelectedInforme(nombreInforme);

            const token = authStorage.getToken();

            const res = await fetch(`${API_URL}/baseProcesal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "x-token": token } : {}),
                },
                body: JSON.stringify({ nombreInforme }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const blob = await res.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${nombreInforme}.csv`;

            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(true);
            console.error(error);
        } finally {
            setLoading(false);
            setSelectedInforme(null);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100">
            <NavBar />

            <main className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-6xl">

                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200">

                        {/* HEADER */}
                        <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-300">
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <CircleStackIcon className="h-6 w-6 text-sky-700" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-sky-700">
                                    Bases Procesales
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Seleccione una base para descargar
                                </p>
                            </div>
                        </div>

                        {/* CHECKBOX CARDS */}
                        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {INFORMES.map((informe) => {
                                const selected = selectedInforme === informe.name;

                                return (
                                    <button
                                        key={informe.name}
                                        type="button"
                                        onClick={() => setSelectedInforme(informe.name)}
                                        className={`relative rounded-xl border p-5 text-left transition-all
                                        ${selected
                                                ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                                                : "border-slate-200 hover:border-sky-300"}
                                        `}
                                    >
                                        {selected && (
                                            <CheckCircleIcon className="absolute top-4 right-4 h-6 w-6 text-sky-600" />
                                        )}

                                        <h3 className="text-sm font-semibold text-slate-800">
                                            {informe.label}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {informe.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t border-gray-300 flex justify-end">
                            <Button
                                variant="info"
                                size="sm"
                                rightIcon={CloudArrowDownIcon}
                                disabled={!selectedInforme || loading}
                                onClick={() => selectedInforme && generarInforme(selectedInforme)}
                                className="cursor-pointer"
                                typeStyle="outline"
                            >
                                {loading ? "Generando..." : "Exportar Informe"}
                            </Button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default BasesProcesales;
