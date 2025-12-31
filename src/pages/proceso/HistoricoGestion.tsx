import { useEffect, useState } from "react";
import type { FC } from "react";
import Card from "../../components/ui/card/Card";
import { CardBody } from "../../components/ui/card/CardBody";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import LoaderLex from "../loaders/Loader";
import { apiFetch } from "../../services/api";

/* =======================
   Types BACKEND
======================= */
interface BackendItem {
    subetapa: string;
    fecha_seleccion: string;
    observacion?: string;
    usuario?: string;
    fecha_modificacion?: string;
}

interface BackendResponse {
    success: boolean;
    data: BackendItem[];
}

/* =======================
   Types UI
======================= */
export interface ItemGestion {
    fecha: string;
    subetapa: string;
    detalleFecha?: string;
    observacion?: string;
    siguienteGestion?: string;
}

export interface HistoricoGestionResponse {
    historico: ItemGestion[];
}

interface Props {
    idProceso: string | number;
}

/* =======================
   Component
======================= */
const HistoricoGestion: FC<Props> = ({ idProceso }) => {
    const [info, setInfo] = useState<HistoricoGestionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!idProceso) return;

        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const json = await apiFetch<BackendResponse>(
                    "/historySub",
                    {
                        method: "POST",
                        auth: true,
                        body: JSON.stringify({
                            idProceso: idProceso.toString()
                        })
                    }
                );

                const adapted: HistoricoGestionResponse = {
                    historico: json.data.map(item => ({
                        fecha: item.fecha_seleccion,
                        subetapa: item.subetapa,
                        observacion: item.observacion,
                        detalleFecha: item.fecha_modificacion,
                        siguienteGestion: item.usuario
                    }))
                };

                if (mounted) setInfo(adapted);

            } catch (err) {
                console.error(err);
                if (mounted) {
                    setError("No se pudo cargar la información.");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [idProceso]);

    /* =======================
       Render
    ======================= */
    if (loading) return <LoaderLex />;

    if (error) {
        return (
            <div className="py-4 text-center text-red-500 text-sm">
                {error}
            </div>
        );
    }

    if (!info || info.historico.length === 0) {
        return (
            <div className="py-4 text-center text-slate-500 text-sm">
                No hay historial disponible.
            </div>
        );
    }
    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center justify-center gap-3 p-4 border-b border-gray-300">
                <div className="bg-sky-100 p-3 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-sky-700" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-sky-700">
                        Historico de gestión
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Modificaciones realizadas al proceso
                    </p>
                </div>
            </div>
            <CardBody className="flex-1 overflow-y-auto min-h-0">
                <div className="relative border-slate-300 pl-1 space-y-2.5">
                    {info.historico.map((item, index) => (
                        <div key={index} className="relative group">

                            <div
                                className="
                                    absolute -left-[14px] top-1 w-3 h-3 rounded-full
                                    bg-sky-500 border-[4px] border-white
                                    shadow transition-transform group-hover:scale-110
                                "
                            />

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-2">

                                {/* HEADER */}
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                                        {item.subetapa}
                                    </p>

                                    <p className="text-[11px] font-medium text-sky-600 whitespace-nowrap">
                                        {item.detalleFecha}
                                    </p>
                                </div>

                                {/* FECHA ACTUACIÓN */}
                                {item.detalleFecha && (
                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                                        <span className="font-medium">Fecha actuación:</span>{" "}
                                        {new Date(item.fecha).toLocaleDateString()}
                                    </p>
                                )}

                                {/* OBSERVACIÓN */}
                                {item.observacion && (
                                    <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
                                        <span className="font-medium">Observación:</span>{" "}
                                        {item.observacion}
                                    </p>
                                )}

                                {/* SIGUIENTE GESTIÓN */}
                                {item.siguienteGestion && (
                                    <p className="text-right text-[11px] text-slate-500 mt-1 italic">
                                        {item.siguienteGestion}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default HistoricoGestion;
