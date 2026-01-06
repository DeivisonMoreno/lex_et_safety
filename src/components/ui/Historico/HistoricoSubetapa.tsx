import React, { useEffect } from "react";
import { useState } from "react";
import { apiFetch } from "../../../services/api";
import LoaderLex from "../../../pages/loaders/Loader";



interface ProcesoProps {
    idProceso: string;
    idRelacionSub: string;
    idRegistroAlterna?: string;
}

export interface Historico {
    fecha: string;
    observacion: string;
    usuario: string;
    fecha_gestion: string;
}

export interface payloadHistorico {
    success: boolean;
    data: Historico[];
}

const HistoricoSubetapa: React.FC<ProcesoProps> = ({ idProceso, idRelacionSub, idRegistroAlterna }) => {
    const [info, setInfo] = useState<Historico[]>([]);
    const [token, setToken] = React.useState('');
    const [loading, setLoading] = React.useState<boolean>(true);
    const [errorFetch, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
    }, []);

    React.useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const payload: Record<string, string> = {
                    idProceso,
                    idRelacionSub,
                };

                if (idRegistroAlterna) {
                    payload.idRegistroAlterna = idRegistroAlterna;
                }

                const data = await apiFetch<payloadHistorico>(
                    "/historyActSub",
                    {
                        method: "POST",
                        auth: true,
                        body: JSON.stringify(payload),
                    }
                );

                if (mounted) {
                    setInfo(data.data);
                }

            } catch (err) {
                console.error("Error cargando información del proceso", err);
                if (mounted) {
                    setError("No se pudo cargar la información.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };


        fetchData();
        return () => { mounted = false };
    }, [idProceso, token]);
    if (loading) {
        return <LoaderLex />
    }

    if (errorFetch) {
        return (
            <div className="p-4 text-sm text-red-400">
                {errorFetch}
            </div>
        );
    }

    if (info.length === 0) {
        return (
            <div className="p-4 text-sm text-slate-400">
                No hay histórico registrado.
            </div>
        );
    }
    return (
        <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="w-full text-center">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">
                    Histórico de actuaciones
                </h4>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-slate-600">
                                Fecha Actuacion
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-slate-600">
                                Observación
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-slate-600">
                                Usuario
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-slate-600">
                                Fecha gestión
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {info.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                                <td className="px-4 py-2 text-slate-600">
                                    {item.fecha}
                                </td>
                                <td className="px-4 py-2 text-slate-600">
                                    {item.observacion}
                                </td>
                                <td className="px-4 py-2 font-medium text-slate-700">
                                    {item.usuario}
                                </td>
                                <td className="px-4 py-2 text-slate-500 whitespace-nowrap">
                                    {item.fecha_gestion}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default HistoricoSubetapa;