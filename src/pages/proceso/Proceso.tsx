import React, { useEffect, useState, type ReactNode } from "react";
import Card from "../../components/ui/card/Card";
import { CardBody } from "../../components/ui/card/CardBody";
import LoaderLex from "../loaders/Loader";
import Swal from "sweetalert2";
import {
    ModalHeader,
    ModalBody,
} from "../../components/modal/ModalParts";
import { Modal } from "../../components/modal/Modal";
import { useModal } from "../../context/ModalContext";
import {
    EyeIcon,
    IdentificationIcon,
    XMarkIcon,
    PencilIcon,
    ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";

import { apiFetch } from "../../services/api";

/* =======================
   BASE TYPES
======================= */

type GenericRecord = Record<string, string | number | null | undefined>;

interface ProcesoProps {
    idProceso: string;
}

/* =======================
   RESPONSES
======================= */

interface DatosGenerales extends GenericRecord { }

interface ProcesoData {
    success: boolean;
    data: {
        datos_generales: DatosGenerales[];
    };
}

interface DatosTipoProceso extends GenericRecord {
    clase: string;
    color: string;
    linea: string;
    marca: string;
    placa: string;
    modelo: number;
    cilindraje: number;
    combustible: string;
    numero_motor: string;
    numero_chasis: string;
    tipo_vehiculo: string;
    fecha_matricula: string;
    capacidad_pasajeros: number;
    numero_licencia_tránsito: string;
    tipo_proceso: string;
    tabla: string;
}

interface DatosAdicionales extends GenericRecord {
    id: string;
    id_proceso: number;
    radicado: string;
    codigo_sapro: string;
    codigo_custodia: string;
    investigacion_bienes: string;
    bienes_encontrados: string;
    libranza: string;
    fecha_vencimiento_pagare: string;
    fecha_suscripcion_pagare: string;
    capital_letras: string;
    direccion_demanda: string;
    ciudad_demanda: string;
    departamento_demanda: string;
    email_demanda: string;
    telefono: string;
    tabla: string;
}

interface DatosTitular extends GenericRecord {
    carpeta: number;
    nombre: string;
    cedula: string;
    nombre_2?: string;
    cedula_2?: string;
    ciudad: string;
    ultima_observacion: string;
}


interface DetailProcessData {
    success: boolean;
    data: {
        datos_tipo_proceso: DatosTipoProceso;
        datos_adicionales: DatosAdicionales;
        datos_titular: DatosTitular;
    };
}


interface ObservacionProcess {
    observacion: string;
    usuario: string;
    fecha_actualizacion: string;
}

interface ObservacionProcessData {
    success: boolean;
    data: {
        observaciones: ObservacionProcess[];
    };
}


interface UpdateFieldPayload {
    idProceso: string;
    tabla: string;
    campo: string;
    valor: string | number;
}

/* =======================
   COMPONENT
======================= */

const Proceso: React.FC<ProcesoProps> = ({ idProceso }) => {
    const { openModal, closeModal } = useModal();

    const [info, setInfo] = useState<ProcesoData | null>(null);
    const [detail, setDetail] = useState<DetailProcessData | null>(null);
    const [detailObservacion, setDetailObservacion] = useState<ObservacionProcessData | null>(null);
    const [loadingObservacion, setLoadingObservacion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [newObservacion, setNewObservacion] = useState("");
    const [sendingObservacion, setSendingObservacion] = useState(false);
    const [token, setToken] = useState("");
    const [usuario, setUsuario] = React.useState<string>('');


    const [editField, setEditField] = useState<{
        tabla: string;
        campo: string;
        valor: string | number;
    } | null>(null);

    /* =======================
       TOKEN
    ======================= */
    useEffect(() => {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem('usuario');
        if (t) setToken(t);
        if (u) setUsuario(u);
    }, []);

    /* =======================
       FETCH PRINCIPAL
    ======================= */
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);

            const data = await apiFetch<ProcesoData>(
                "/processOnly",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({ idProceso }),
                }
            );

            setInfo(data);
            setLoading(false);
        };

        fetchData();
    }, [idProceso, token]);


    /* =======================
       FETCH DETALLE
    ======================= */
    const fetchDetailProcess = async () => {
        setLoadingDetail(true);

        const data = await apiFetch<DetailProcessData>(
            "/detailProcess",
            {
                method: "POST",
                auth: true,
                body: JSON.stringify({ idProceso }),
            }
        );

        setDetail(data);
        setLoadingDetail(false);
    };

    /* =======================
       FETCH OBSERVACIONES
    ======================= */
    const fetchObservacionProcess = async () => {
        setLoadingObservacion(true);

        const data = await apiFetch<ObservacionProcessData>(
            "/observationProcess",
            {
                method: "POST",
                auth: true,
                body: JSON.stringify({ idProceso }),
            }
        );

        setDetailObservacion(data);
        setLoadingObservacion(false);
    };

    /* =======================
       UPDATE
    ======================= */
    const updateProcessField = async ({
        idProceso,
        tabla,
        campo,
        valor,
    }: UpdateFieldPayload) => {

        const result = await apiFetch<any>(
            "/updateDateProceso",
            {
                method: "POST",
                auth: true,
                body: JSON.stringify({
                    idProceso,
                    tabla,
                    campo,
                    valor,
                }),
            }
        );

        if (result.success) {
            await Swal.fire({
                icon: "success",
                title: "Éxito",
                text: result.message,
                confirmButtonColor: "#0F4C81",
            });
        } else {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: result.message || "No fue posible actualizar el dato",
            });
        }

        await fetchDetailProcess();
    };


    /* =======================
       HELPERS
    ======================= */

    const formatLabel = (key: string) =>
        key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    const EXCLUDED_FIELDS = ["tabla", "id", "id_proceso"];

    const filterRenderableFields = (obj: GenericRecord) =>
        Object.entries(obj).filter(
            ([key, value]) =>
                !EXCLUDED_FIELDS.includes(key) &&
                value !== undefined
        );

    const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
        <div className="flex justify-between py-1.5">
            <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-xs font-medium text-slate-900">
                    {value ?? "—"}
                </div>
            </div>
        </div>
    );

    const EditableInfoRow = ({
        label,
        value,
        campo,
        tabla,
    }: {
        label: string;
        value?: string | number;
        campo: string;
        tabla: string;
    }) => (
        <div className="flex justify-between items-center py-1.5 group">
            <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-xs font-medium text-slate-900">
                    {value ?? "—"}
                </div>
            </div>

            <button
                onClick={() => {
                    setEditField({
                        tabla,
                        campo,
                        valor: value ?? "",
                    });
                    openModal("editField");
                }}
                className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-blue-600"
            >
                <PencilIcon className="h-4 w-4" />
            </button>
        </div>
    );


    const InfoCard = ({ title, children }: { title: string; children: ReactNode }) => (
        <div className="rounded-lg border border-slate-200 bg-white">
            <div className="px-3 py-1.5 border-b text-[10px] font-semibold text-slate-700">
                {title}
            </div>
            <div className="px-3 py-2 space-y-1">
                {children}
            </div>
        </div>
    );


    if (loading) return <LoaderLex />;

    return (
        <>
            {/* CARD PRINCIPAL */}
            <Card className="w-1/4" stretch>
                <div className="flex items-center gap-3 p-4 border-b border-gray-300">
                    <div className="bg-sky-100 p-3 rounded-lg">
                        <IdentificationIcon className="h-6 w-6 text-sky-700" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-sky-700">
                            Datos Generales del Proceso
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Información principal del titular
                        </p>
                    </div>
                </div>
                <CardBody className="p-0 overflow-y-auto">
                    <div className="max-h-[720px] overflow-y-auto divide-y divide-gray-100">
                        {info?.data?.datos_generales?.length ? (
                            Object.entries(info.data.datos_generales[0]).map(([key, value]) => {
                                const formattedKey = key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase());

                                return (
                                    <div
                                        key={key}
                                        className="grid grid-cols-12 gap-2 px-3 py-1 hover:bg-slate-50 transition"
                                    >
                                        <span className="col-span-5 text-[10px] text-slate-500 font-medium truncate">
                                            {formattedKey}
                                        </span>
                                        <span className="col-span-7 text-[10px] text-slate-800 font-semibold break-words">
                                            {String(value) || "—"}
                                        </span>
                                    </div>

                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-xs text-gray-400">
                                Sin información disponible
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-5">
                        <button
                            type="button"
                            className="
                                group flex flex-col items-center justify-center gap-1
                                rounded-lg border border-gray-200 bg-white
                                px-2 py-2
                                text-gray-600
                                shadow-sm
                                transition-all
                                hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                            "
                            onClick={() => {
                                fetchDetailProcess();
                                openModal("detalleTitular");
                            }}
                        >
                            <EyeIcon className="h-4 w-4 transition-colors group-hover:text-blue-600" />
                            <span className="leading-tight text-center text-xs">
                                Detalle del titular
                            </span>
                        </button>
                        <button
                            type="button"
                            className="
                                group flex flex-col items-center justify-center gap-1
                                rounded-lg border border-gray-200 bg-white
                                px-2 py-2
                                text-gray-600
                                shadow-sm
                                transition-all
                                hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                            "
                            onClick={() => {
                                fetchObservacionProcess();
                                openModal("observacionesProceso");
                            }}
                        >
                            <ChatBubbleBottomCenterIcon className="h-4 w-4 transition-colors group-hover:text-blue-600" />
                            <span className="leading-tight text-center text-xs">
                                Observaciones Proceso
                            </span>
                        </button>
                    </div>

                </CardBody>
            </Card>

            {/* MODAL DETALLE */}
            <Modal id="detalleTitular" size="xl">
                <ModalHeader>
                    <div className="flex justify-between">
                        <span>Detalle del proceso</span>
                        <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={() => closeModal("detalleTitular")} />
                    </div>
                </ModalHeader>

                <ModalBody>
                    {loadingDetail || !detail ? (
                        <div className="text-center py-12">Cargando...</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* DATOS ADICIONALES */}
                            <InfoCard title="Datos Adicionales">
                                {filterRenderableFields(detail?.data?.datos_adicionales ?? {}).map(
                                    ([key, value]) => (
                                        <EditableInfoRow
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value ?? ""}
                                            campo={key}
                                            tabla={detail?.data?.datos_adicionales?.tabla ?? ""}
                                        />
                                    )
                                )}
                            </InfoCard>


                            {/* VEHÍCULO */}
                            <InfoCard title="Datos Tipo Proceso">
                                {filterRenderableFields(detail?.data?.datos_tipo_proceso ?? {}).map(
                                    ([key, value]) => (
                                        <EditableInfoRow
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value ?? ""}
                                            campo={key}
                                            tabla={detail.data.datos_tipo_proceso.tabla}
                                        />
                                    )
                                )}
                            </InfoCard>

                            {/* TITULAR */}
                            <InfoCard title="Datos Titular">
                                {filterRenderableFields(detail?.data?.datos_titular ?? {}).map(
                                    ([key, value]) => (
                                        <InfoRow
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value ?? ""}

                                        />
                                    )
                                )}
                            </InfoCard>
                        </div>
                    )}
                </ModalBody>
            </Modal>

            <Modal id="editField" size="sm">
                <ModalHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Editar campo
                        </h3>

                        <button
                            onClick={() => closeModal("editField")}
                            className="
                    rounded-md p-1
                    text-slate-400 hover:text-slate-600
                    hover:bg-slate-100
                    transition
                "
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-4">

                        {/* INPUT */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                Nuevo valor
                            </label>

                            <input
                                autoFocus
                                className="
                        w-full
                        rounded-lg
                        border border-slate-300
                        bg-white
                        px-3 py-2
                        text-sm text-slate-900
                        shadow-sm
                        transition
                        focus:border-blue-500
                        focus:ring-2 focus:ring-blue-200
                        outline-none
                    "
                                value={editField?.valor ?? ""}
                                onChange={(e) =>
                                    setEditField(prev =>
                                        prev ? { ...prev, valor: e.target.value } : null
                                    )
                                }
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2 pt-2 border-t">

                            {/* CANCELAR */}
                            <button
                                onClick={() => closeModal("editField")}
                                className="
                        inline-flex items-center
                        rounded-lg
                        px-4 py-2
                        text-xs font-medium
                        text-slate-600
                        hover:bg-slate-100
                        transition
                    "
                            >
                                Cancelar
                            </button>

                            {/* GUARDAR */}
                            <button
                                onClick={async () => {
                                    if (!editField) return;

                                    await updateProcessField({
                                        idProceso,
                                        tabla: editField.tabla,
                                        campo: editField.campo,
                                        valor: editField.valor,
                                    });

                                    closeModal("editField");
                                }}
                                className="
                                            inline-flex items-center justify-center
                                            rounded-lg
                                            bg-blue-600
                                            px-4 py-2
                                            text-xs font-semibold
                                            text-white
                                            shadow-sm
                                            transition
                                            hover:bg-blue-700
                                            focus:ring-2 focus:ring-blue-400
                                            disabled:opacity-50
                                        "
                            >
                                Guardar cambios
                            </button>

                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal id="observacionesProceso" size="lg">
                <ModalHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Observaciones del proceso
                        </h3>

                        <button
                            onClick={() => closeModal("observacionesProceso")}
                            className="
                    rounded-md p-1
                    text-slate-400 hover:text-slate-600
                    hover:bg-slate-100
                    transition
                "
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </ModalHeader>

                <ModalBody>
                    {loadingObservacion ? (
                        <div className="py-10 text-center text-[9px] text-slate-400">
                            Cargando observaciones…
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                <label className="block mb-1 text-[8px] font-semibold text-slate-600">
                                    Nueva observación
                                </label>

                                <textarea
                                    rows={3}
                                    value={newObservacion}
                                    onChange={(e) => setNewObservacion(e.target.value)}
                                    placeholder="Escriba una observación sobre el proceso…"
                                    className="
            w-full resize-none
            rounded-md border border-slate-300
            bg-white px-2 py-1.5
            text-[9px] text-slate-700
            placeholder:text-slate-400
            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
          "
                                />

                                <div className="mt-2 flex justify-end">
                                    <button
                                        disabled={!newObservacion.trim() || sendingObservacion}
                                        onClick={async () => {
                                            if (!newObservacion.trim()) return;

                                            setSendingObservacion(true);

                                            await fetch(
                                                "https://belle-prosaic-darrin.ngrok-free.dev/api/newObservationProcess",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "x-token": token,
                                                    },
                                                    body: JSON.stringify({
                                                        idProceso,
                                                        observacion: newObservacion,
                                                        usuario,
                                                    }),
                                                }
                                            );

                                            setNewObservacion("");
                                            await fetchObservacionProcess();
                                            setSendingObservacion(false);
                                        }}
                                        className="
              inline-flex items-center gap-1.5
              rounded-md bg-sky-600
              px-3 py-1
              text-[9px] font-medium text-white
              shadow-sm
              transition
              hover:bg-sky-700
              disabled:cursor-not-allowed disabled:bg-sky-300
            "
                                    >
                                        {sendingObservacion ? "Guardando..." : "Agregar observación"}
                                    </button>
                                </div>
                            </div>
                            {!detailObservacion?.data.observaciones.length && (
                                <div className="py-6 text-center text-[9px] text-slate-400">
                                    No hay observaciones registradas
                                </div>
                            )}
                            {!!detailObservacion?.data.observaciones.length && (
                                <div className="rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="relative overflow-x-auto">
                                        <table className="min-w-full text-[9px] border-collapse">
                                            <thead className="sticky top-0 z-10 bg-slate-100">
                                                <tr>
                                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 border-b">
                                                        Observación
                                                    </th>
                                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 border-b">
                                                        Usuario
                                                    </th>
                                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 border-b">
                                                        Fecha
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-100">
                                                {detailObservacion.data.observaciones.map((item, index) => (
                                                    <tr key={index} className="hover:bg-sky-50">
                                                        <td className="px-3 py-2 max-w-md break-words">
                                                            {item.observacion}
                                                        </td>
                                                        <td className="px-3 py-2 font-medium">
                                                            {item.usuario}
                                                        </td>
                                                        <td className="px-3 py-2 text-[8px] text-slate-500">
                                                            {new Date(item.fecha_actualizacion).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ModalBody>
            </Modal>


        </>
    );
};

export default Proceso;
