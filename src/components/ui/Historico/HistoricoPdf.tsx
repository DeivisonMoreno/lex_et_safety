import { useEffect, useState } from "react";
import LoaderLex from "../../../pages/loaders/Loader";
import {
    CloudArrowDownIcon,
    ArrowUpTrayIcon,
    NewspaperIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { useAlert } from "../../../hooks/useAlert";
import { apiFetch, apiFetchBlob } from "../../../services/api";
import clsx from "clsx";

interface Props {
    idProceso: string | number;
    idRelacionSub: string | number;
}

export interface Documentos {
    id: string;
    usuario: string;
    fecha: string;
    nombre: string;
    estado: boolean;
    usuario_elimina: string;
    fecha_elimina: string;
}

export interface PayloadPdf {
    success: boolean;
    data: Documentos[];
}

const HistoricoPdf: React.FC<Props> = ({ idProceso, idRelacionSub }) => {
    const [info, setInfo] = useState<Documentos[]>([]);
    const [token, setToken] = useState("");
    const [usuario, setUsuario] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorFetch, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const { success, error } = useAlert();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("usuario");
        if (storedToken) setToken(storedToken);
        if (storedUser) setUsuario(storedUser);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFetch<PayloadPdf>(
                "/listDocuments",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({
                        idProceso,
                        idRelacionSub,
                    }),
                }
            );

            if (!result.success) {
                throw new Error("Error al cargar documentos");
            }

            setInfo(result.data);

        } catch (error) {
            console.error(error);
            setError("No se pudo cargar la información.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token, idProceso]);

    const uploadDocumentos = async () => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach(file => formData.append("files", file));
        formData.append("idProceso", String(idProceso));
        formData.append("idRelacionSub", String(idRelacionSub));
        formData.append("usuario", usuario);

        setLoading(true);
        setError(null);

        try {
            const result = await apiFetch<{ success: boolean }>(
                "/uploadDocumento",
                {
                    method: "POST",
                    auth: true,
                    body: formData,
                }
            );

            if (!result.success) {
                throw new Error("Error cargando documentos");
            }

            await fetchData();
            setFiles(null);

        } catch (err) {
            console.error(err);
            setError("Error cargando documentos.");
        } finally {
            setLoading(false);
        }
    };


    const downloadDocumento = async (id: number) => {
        try {
            const blob = await apiFetchBlob(
                "/downloadDocumento",
                {
                    method: "POST",
                    auth: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                }
            );

            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 5000);

        } catch (err) {
            console.error(err);
            setError("No se pudo descargar el documento.");
        }
    };



    const deleteDocument = async (id: number) => {
        try {
            const result = await apiFetch<{ success: boolean; message?: string }>(
                "/deleteDocument",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({
                        id,
                        usuario,
                    }),
                }
            );

            if (result.success) {
                success("Archivo eliminado correctamente");
                await fetchData();
            } else {
                throw new Error(result.message);
            }

        } catch (err) {
            console.error(err);
            error("Algo ocurrió al eliminar el documento, intente nuevamente");
        }
    };


    if (loading) return <LoaderLex />;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Upload */}
            <div className="lg:col-span-4">
                <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <ArrowUpTrayIcon className="h-8 w-8" />
                        </div>

                        <h3 className="text-base font-semibold text-slate-700">
                            Cargar documentos
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Adjunta archivos PDF o imágenes
                        </p>

                        <label className="mt-6 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-white px-4 py-6 text-sm text-slate-500 transition hover:bg-sky-50">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={e => setFiles(e.target.files)}
                            />
                            <span className="font-medium text-sky-600">
                                Click para seleccionar archivos
                            </span>
                            <span className="text-xs text-slate-400">
                                o arrástralos aquí
                            </span>
                        </label>

                        {files && (
                            <p className="mt-3 text-xs text-slate-500">
                                {files.length} archivo(s) seleccionado(s)
                            </p>
                        )}

                        <button
                            onClick={uploadDocumentos}
                            disabled={!files}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-40"
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            Enviar documentos
                        </button>
                    </div>
                </div>

            </div>

            {/* Table */}
            <div className="lg:col-span-8">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-start border-b border-slate-200 px-5 py-2">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <div className="bg-sky-100 px-2 py-2 rounded-lg">
                                <NewspaperIcon className="h-5 w-5 text-sky-500" />
                            </div>
                            Historico de documentos
                        </h4>
                    </div>

                    {info.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">
                            No hay documentos cargados
                        </div>
                    ) : (
                        <div className="max-h-[367px] overflow-y-auto p-4 space-y-3">
                            {info.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-4">
                                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                                            <NewspaperIcon className="h-6 w-6" />
                                        </div> */}

                                        <div className="max-w-md">
                                            <p className="truncate font-semibold text-slate-700">
                                                {item.nombre}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {item.fecha} · {item.usuario}
                                            </p>
                                            <div className="mt-2 w-full flex items-center gap-2">
                                                <span
                                                    className={clsx(
                                                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                                        item.estado
                                                            ? "bg-emerald-100 text-emerald-600"
                                                            : "bg-red-100 text-red-600"
                                                    )}
                                                >
                                                    {item.estado ? "Disponible" : "Eliminado"}
                                                </span>
                                                <span className="text-xs text-slate-500/50">{item.fecha_elimina} - {item.usuario_elimina}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => downloadDocumento(Number(item.id))}
                                            disabled={!item.estado}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 text-sky-600 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                                            title="Descargar documento"
                                        >
                                            <CloudArrowDownIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteDocument(Number(item.id))}
                                            disabled={!item.estado}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/50 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                                            title="Eliminar Documento"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HistoricoPdf;
