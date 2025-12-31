import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

import LoaderLex from "../loaders/Loader";
import Navbar from "../../components/shared/Navbar";
import { apiFetch } from "../../services/api";

/* =======================
   TYPES
======================= */

export interface Proceso {
    id: number;
    carpeta: number;
    fecha_recibo: string;
    nombre: string;
    cedula: string;
    tipo_proceso: string;
    clasificacion: string;
    sub_clasificacion: string;
    subetapa_ultimo: string;
}

export interface ResponseProcess {
    success: boolean;
    data: Proceso[];
}

/* =======================
   COMPONENT
======================= */

const Procesos: React.FC = () => {
    const [info, setInfo] = useState<Proceso[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const redStates = ["DEVOLUCION", "TERMINACIÓN"];

    /* =======================
       ACTIONS
    ======================= */

    const verProceso = (id: number) => {
        localStorage.setItem("idProceso", String(id));
        navigate("/proceso");
    };

    /* =======================
       FETCH
    ======================= */

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await apiFetch<ResponseProcess>(
                    "/process",
                    {
                        method: "POST",
                        auth: true,
                    }
                );

                if (res.success) {
                    setInfo(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* =======================
       FILTER
    ======================= */

    const filteredInfo = useMemo(() => {
        if (!search.trim()) return info;

        const value = search.toLowerCase();

        return info.filter((p) =>
            Object.values(p).some((v) =>
                String(v).toLowerCase().includes(value)
            )
        );
    }, [info, search]);

    /* =======================
       RENDER
    ======================= */
    const red = ["DEVOLUCION", "TERMINACIÓN"];
    const VerProceso = (id: string) => {
        localStorage.setItem("idProceso", id);
        navigate("/proceso");
    };

    if (loading) return <LoaderLex />;
    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100">
            <Navbar />

            <main className="flex-1 overflow-hidden p-3">
                <section className="h-full rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col">

                    {/* HEADER */}
                    <div className="grid grid-cols-3 items-center px-4 py-3 border-b border-slate-200">
                        <div>
                            <h2 className="text-[12px] font-semibold text-slate-800">
                                Procesos Jurídicos
                            </h2>
                            <p className="text-[9px] text-slate-500">
                                Gestión y seguimiento de procesos
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <input
                                type="text"
                                placeholder="Buscar proceso..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                                    w-full max-w-md rounded-md
                                    border border-slate-300
                                    px-3 py-1.5
                                    text-[10px]
                                    placeholder-slate-400
                                    focus:outline-none
                                    focus:ring-1
                                    focus:ring-blue-600
                                "
                            />
                        </div>

                        <div className="flex justify-end">
                            <span className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest">
                                Lex Et Safety
                            </span>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full text-[10px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {[
                                        "Cliente",
                                        "Carpeta",
                                        "Proceso",
                                        "Clasificación",
                                        "Subetapa",
                                        "Fecha",
                                        "Acción",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-2 text-left font-semibold text-slate-600 uppercase text-[9px]"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredInfo.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-slate-50 transition"
                                    >
                                        {/* Cliente */}
                                        <td className="px-4 py-2">
                                            <p className="font-medium text-slate-800 text-[10px]">
                                                {p.nombre}
                                            </p>
                                            <p className="text-[9px] text-slate-500">
                                                CC {p.cedula}
                                            </p>
                                        </td>

                                        <td className="px-4 py-2 text-slate-700">
                                            {p.carpeta}
                                        </td>

                                        <td className="px-4 py-2 text-slate-700">
                                            {p.tipo_proceso}
                                        </td>

                                        <td className="px-4 py-2">
                                            <span
                                                className={clsx(
                                                    "rounded px-2 py-0.5 text-[9px] font-semibold",
                                                    red.includes(p.clasificacion)
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-emerald-100 text-emerald-700"
                                                )}
                                            >
                                                {p.clasificacion}
                                            </span>
                                        </td>

                                        <td className="px-4 py-2 text-slate-700">
                                            {p.subetapa_ultimo}
                                        </td>

                                        <td className="px-4 py-2 text-slate-500">
                                            {new Date(
                                                p.fecha_recibo
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() =>
                                                    VerProceso(String(p.id))
                                                }
                                                className="
                                                    inline-flex items-center gap-1
                                                    text-[9px] font-semibold
                                                    text-gray-950
                                                    hover:underline
                                                    cursor-pointer
                                                "
                                            >
                                                Ver
                                                <PaperAirplaneIcon className="h-3 w-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredInfo.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-6 text-center text-[9px] text-slate-400"
                                        >
                                            No se encontraron resultados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <Outlet />
            </main>
        </div>
    );
};

export default Procesos;
