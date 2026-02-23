import React, { useEffect, useState, type ReactNode } from "react";
import Card from "../../components/ui/card/Card";
import { CardBody } from "../../components/ui/card/CardBody";
import LoaderLex from "../loaders/Loader";
import Swal from "sweetalert2";
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "../../components/modal/ModalParts";
import { Modal } from "../../components/modal/Modal";
import { useModal } from "../../context/ModalContext";
import {
    EyeIcon,
    IdentificationIcon,
    XMarkIcon,
    PencilIcon,
    ChatBubbleBottomCenterIcon,
    CreditCardIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
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

interface DatosBasicos extends GenericRecord {
    cuantia: string;
    juzgado_inicial: string;
    juzgado_conocimiento: string;
    clasificacion: string;
    sub_clasificacion: string;
    sub_clasificacion_alterna: string;
}


interface DetailProcessData {
    success: boolean;
    data: {
        datos_tipo_proceso: DatosTipoProceso;
        datos_adicionales: DatosAdicionales;
        datos_titular: DatosTitular;
        datos_basicos: DatosBasicos
    };
}

export interface DataCredit {
    id: number;
    obligacion: string;
    capital: string;
    diasmora: string;
}


interface DetailCredit {
    success: boolean;
    data: {
        obligaciones: DataCredit[];
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


interface OptionBase {
    id: number;
}

interface Cuantia extends OptionBase {
    cuantia: string;
}

interface TipoProceso extends OptionBase {
    tipo_proceso: string;
}

interface Juzgado extends OptionBase {
    juzgado: string;
}

interface Dependiente extends OptionBase {
    dependiente: string;
}

interface Clasificacion extends OptionBase {
    nombre: string;
}


interface DataNewProcessResponse {
    success: boolean;
    data: {
        cuantia: Cuantia[];
        tipo_proceso: TipoProceso[];
        juzgado: Juzgado[];
        dependiente: Dependiente[];
        clasificacion: Clasificacion[];
    };
}

type CatalogKey = keyof DataNewProcessResponse["data"];

const FIELD_CATALOG_MAP: Record<string, CatalogKey> = {
    cuantia_id: "cuantia",
    tipo_proceso_id: "tipo_proceso",
    juzgado_conocimiento_id: "juzgado",
    juzgado_inicial_id: "juzgado",
    clasificacion_id: "clasificacion",
    sub_clasificacion_id: "clasificacion",
    sub_clasificacion_alterna_id: "clasificacion",
};


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
    const [loadingCreditos, setLoadingCreditos] = useState(false);
    const [obligaciones, setObligaciones] = useState<DetailCredit | null>(null);
    const [creating, setCreating] = useState(false);

    const [newObligacion, setNewObligacion] = useState({
        obligacion: "",
        capital: "",
        diasmora: "",
    });

    const [editingObligaciones, setEditingObligaciones] = useState<Record<number, any>>({});
    const [updatingId, setUpdatingId] = useState<number | null>(null);


    const getCatalogOptions = (
        campo: string,
        catalogos: DataNewProcessResponse["data"] | null
    ) => {
        if (!catalogos) return null;

        const catalogKey = FIELD_CATALOG_MAP[campo];
        if (!catalogKey) return null;

        const labelKeyMap: Record<CatalogKey, string> = {
            cuantia: "cuantia",
            tipo_proceso: "tipo_proceso",
            juzgado: "juzgado",
            dependiente: "dependiente",
            clasificacion: "nombre",
        };

        return catalogos[catalogKey].map(item => ({
            id: item.id,
            label: (item as any)[labelKeyMap[catalogKey]],
        }));
    };

    function resolveCatalogId(
        campo: string,
        label: string,
        catalogos: DataNewProcessResponse["data"] | null
    ): number | "" {
        if (!catalogos || !label) return "";

        const catalogKey = FIELD_CATALOG_MAP[campo];
        if (!catalogKey) return "";

        const catalog = catalogos[catalogKey];

        const found = catalog.find(
            (item: any) =>
                Object.values(item).some(v => String(v).toLowerCase() === label.toLowerCase())
        );


        return found?.id ?? "";
    }


    const isCatalogField = (campo: string) =>
        Object.prototype.hasOwnProperty.call(FIELD_CATALOG_MAP, campo);

    useEffect(() => {
        if (obligaciones?.data?.obligaciones) {
            const initialState: typeof editingObligaciones = {};

            obligaciones.data.obligaciones.forEach((item) => {
                initialState[item.id] = {
                    obligacion: item.obligacion,
                    capital: item.capital,
                    diasmora: item.diasmora,
                };
            });

            setEditingObligaciones(initialState);
        }
    }, [obligaciones]);

    const handleChangeObligacion = (
        id: number,
        field: "obligacion" | "capital" | "diasmora",
        value: string
    ) => {
        setEditingObligaciones(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };



    const actualizarObligacion = async (id: number) => {
        const payload = editingObligaciones[id];
        if (!payload) return;

        try {
            setUpdatingId(id);

            const data = await apiFetch<any>(
                "/actualizarObligacion",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({
                        id,
                        idProceso,
                        ...payload,
                    }),
                }
            );

            if (!data?.success) {
                throw new Error("Error al actualizar obligación");
            }

            fetchObligaciones();
            setEditingObligaciones(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });

        } catch (error) {
            console.error("Error actualizando obligación", error);
        } finally {
            setUpdatingId(null);
        }
    };




    const crearObligacion = async () => {
        if (creating) return;
        if (!newObligacion.obligacion || !newObligacion.capital) return;

        try {
            setCreating(true);

            const payload = {
                idProceso,
                obligacion: newObligacion.obligacion.trim(),
                capital: newObligacion.capital,
                diasmora: newObligacion.diasmora || "0",
            };

            const data = await apiFetch<{ success: boolean }>(
                "/crearObligacion",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify(payload),
                }
            );

            if (!data?.success) {
                throw new Error("Error al crear obligación");
            }
            setNewObligacion({
                obligacion: "",
                capital: "",
                diasmora: "",
            });

            await fetchObligaciones();
            closeModal("nuevaObligacion");

        } catch (error) {
            console.error("Error creando obligación", error);
        } finally {
            setCreating(false);
        }
    };


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


    const [catalogos, setCatalogos] =
        useState<DataNewProcessResponse["data"] | null>(null);
    useEffect(() => {
        const fetchDataProcess = async () => {
            try {
                setLoading(true);

                const data = await apiFetch<DataNewProcessResponse>(
                    "/dataNewProcess",
                    {
                        method: "POST",
                        auth: true,
                    }
                );

                setCatalogos(data.data);
            } catch (err) {
                console.error(err);

            } finally {
                setLoading(false);
            }
        };

        fetchDataProcess();
    }, []);

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
   FETCH DETALLE
======================= */
    const fetchObligaciones = async () => {
        setLoadingCreditos(true);

        const data = await apiFetch<DetailCredit>(
            "/searchObligaciones",
            {
                method: "POST",
                auth: true,
                body: JSON.stringify({ idProceso }),
            }
        );

        console.log(data);

        setObligaciones(data);
        setLoadingCreditos(false);
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
                    usuario,
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

    const crearObservacion = async () => {
        if (!newObservacion.trim()) return;

        try {
            setSendingObservacion(true);

            const result = await apiFetch<any>(
                "/newObservationProcess",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({
                        idProceso,
                        observacion: newObservacion,
                        usuario,
                    }),
                }
            );

            if (result?.success === false) {
                throw new Error(result?.message || "Error al guardar observación");
            }

            setNewObservacion("");
            await fetchObservacionProcess();

        } catch (error) {
            console.error(error);
        } finally {
            setSendingObservacion(false);
        }
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
        displayValue,
        editValue,
        campo,
        tabla,
    }: {
        label: string;
        displayValue?: string;
        editValue?: string | number;
        campo: string;
        tabla: string;
    }) => (
        <div className="flex justify-between items-center py-1.5 group">
            <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-xs font-medium text-slate-900">
                    {displayValue ?? "—"}
                </div>
            </div>

            <button
                onClick={() => {
                    setEditField({
                        tabla,
                        campo,
                        valor: editValue ?? "",
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
            <Card stretch>
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
                    <div className="h-full overflow-y-auto divide-y divide-gray-100">
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
                                fetchObligaciones();
                                openModal("obligacionesModal");
                            }}
                        >
                            <CreditCardIcon className="h-4 w-4 transition-colors group-hover:text-blue-600" />
                            <span className="leading-tight text-center text-xs">
                                Obligaciones
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
                        <div className="text-center py-12 text-sm text-slate-400">
                            Cargando...
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-4">

                            {/* DATOS BÁSICOS */}
                            <InfoCard title="Datos Básicos">
                                {filterRenderableFields(detail?.data?.datos_basicos ?? {}).map(
                                    ([key, value]) => {
                                        const campo = `${key}_id`;

                                        const editValue = resolveCatalogId(
                                            campo,
                                            value as string,
                                            catalogos
                                        );

                                        return (
                                            <EditableInfoRow
                                                key={key}
                                                label={formatLabel(key)}
                                                displayValue={value as string}
                                                editValue={editValue}
                                                campo={campo}
                                                tabla="tbl_proceso"
                                            />
                                        );
                                    }
                                )}
                            </InfoCard>
                            {/* DATOS ADICIONALES */}
                            <InfoCard title="Datos Adicionales">
                                {filterRenderableFields(detail?.data?.datos_adicionales ?? {}).map(
                                    ([key, value]) => {
                                        if (key !== 'proceso_id') {
                                            return (
                                                <EditableInfoRow
                                                    key={key}
                                                    label={formatLabel(key)}
                                                    displayValue={value as string}
                                                    campo={key}
                                                    tabla={detail?.data?.datos_adicionales?.tabla ?? ""}
                                                />
                                            );
                                        }
                                    }
                                )}
                            </InfoCard>

                            {/* DATOS TIPO PROCESO */}
                            <InfoCard title="Datos Tipo Proceso">
                                {filterRenderableFields(detail?.data?.datos_tipo_proceso ?? {}).map(
                                    ([key, value]) => (
                                        <EditableInfoRow
                                            key={key}
                                            label={formatLabel(key)}
                                            displayValue={value as string}
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

                            {editField && isCatalogField(editField.campo) ? (
                                <select
                                    autoFocus
                                    value={editField.valor}
                                    onChange={(e) =>
                                        setEditField(prev =>
                                            prev ? { ...prev, valor: Number(e.target.value) } : null
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                >
                                    {getCatalogOptions(editField.campo, catalogos)?.map(opt => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    autoFocus
                                    value={editField?.valor ?? ""}
                                    onChange={(e) =>
                                        setEditField(prev =>
                                            prev ? { ...prev, valor: e.target.value } : null
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        bg-white
                                        px-3 py-2
                                        text-sm
                                        shadow-sm
                                        focus:border-blue-500
                                        focus:ring-2 focus:ring-blue-200
                                        outline-none
                                    "
                                />
                            )}
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
                                        onClick={crearObservacion}
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

            <Modal id="obligacionesModal" size="lg">
                <ModalHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Obligaciones
                        </h3>

                        <button
                            onClick={() => closeModal("obligacionesModal")}
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
                    {loadingCreditos ? (
                        <div className="py-10 text-center text-xs text-slate-400">
                            Cargando obligaciones…
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[420px] overflow-y-auto">
                            {obligaciones?.data?.obligaciones?.length ? (
                                obligaciones.data.obligaciones.map(item => {
                                    const local = editingObligaciones[item.id] || item;

                                    return (
                                        <div
                                            key={item.id}
                                            className="
                                    grid grid-cols-12 gap-3
                                    items-center
                                    rounded-lg border border-slate-200
                                    bg-white
                                    px-4 py-3
                                    shadow-sm
                                    hover:border-indigo-300
                                    transition
                                "
                                        >
                                            {/* Obligación */}
                                            <div className="col-span-12 md:col-span-4">
                                                <label className="block text-[10px] text-slate-500 mb-1">
                                                    Obligación
                                                </label>
                                                <input
                                                    type="text"
                                                    value={local.obligacion}
                                                    onChange={e =>
                                                        handleChangeObligacion(
                                                            item.id,
                                                            "obligacion",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="
                                            w-full rounded-md
                                            border border-slate-300
                                            px-2 py-1
                                            text-xs
                                            focus:border-sky-500
                                            focus:ring-1 focus:ring-sky-500
                                        "
                                                />
                                            </div>

                                            {/* Capital */}
                                            <div className="col-span-6 md:col-span-3">
                                                <label className="block text-[10px] text-slate-500 mb-1">
                                                    Capital
                                                </label>
                                                <input
                                                    type="text"
                                                    value={local.capital}
                                                    onChange={e =>
                                                        handleChangeObligacion(
                                                            item.id,
                                                            "capital",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="
                                            w-full rounded-md
                                            border border-slate-300
                                            px-2 py-1
                                            text-xs
                                            text-right
                                            focus:border-sky-500
                                            focus:ring-1 focus:ring-sky-500
                                        "
                                                />
                                            </div>

                                            {/* Días mora */}
                                            <div className="col-span-4 md:col-span-2">
                                                <label className="block text-[10px] text-slate-500 mb-1">
                                                    Días mora
                                                </label>
                                                <input
                                                    type="number"
                                                    value={local.diasmora}
                                                    onChange={e =>
                                                        handleChangeObligacion(
                                                            item.id,
                                                            "diasmora",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="
                                            w-full rounded-md
                                            border border-slate-300
                                            px-2 py-1
                                            text-xs
                                            text-center
                                            focus:border-sky-500
                                            focus:ring-1 focus:ring-sky-500
                                        "
                                                />
                                            </div>

                                            {/* Acciones */}
                                            <div className="col-span-2 md:col-span-3 flex justify-end gap-2 pt-4 md:pt-0">
                                                <button
                                                    onClick={() => actualizarObligacion(item.id)}
                                                    disabled={updatingId === item.id}
                                                    className="
                                            rounded-md
                                            bg-sky-600
                                            px-3 py-1
                                            text-[10px] text-white
                                            hover:bg-sky-700
                                            disabled:bg-slate-300
                                            transition
                                        "
                                                >
                                                    {updatingId === item.id
                                                        ? "Actualizando..."
                                                        : "Actualizar"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    No hay obligaciones registradas
                                </div>
                            )}
                        </div>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="info"
                        size="sm"
                        rightIcon={PlusIcon}
                        typeStyle="solid"
                        className="hover:cursor-pointer"
                        onClick={() => openModal("nuevaObligacion")}
                        disabled={creating}
                    >
                        {creating ? "Creando..." : "Crear Obligación"}
                    </Button>
                </ModalFooter>
            </Modal>



            <Modal id="nuevaObligacion" size="lg">
                <ModalHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                                Añadir obligación
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Registre los datos de la nueva obligación
                            </p>
                        </div>

                        <button
                            onClick={() => closeModal("nuevaObligacion")}
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
                    <div className="space-y-6">

                        {/* FORM */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* OBLIGACIÓN */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Obligación
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: 123123213"
                                    value={newObligacion.obligacion}
                                    onChange={(e) =>
                                        setNewObligacion({
                                            ...newObligacion,
                                            obligacion: e.target.value,
                                        })
                                    }
                                    className="
                            rounded-lg px-3 py-2 text-sm
                            border border-slate-300
                            focus:outline-none
                            focus:ring-2 focus:ring-sky-500
                        "
                                />
                            </div>

                            {/* CAPITAL */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Capital
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ej: 15000000"
                                    value={newObligacion.capital}
                                    onChange={(e) =>
                                        setNewObligacion({
                                            ...newObligacion,
                                            capital: e.target.value,
                                        })
                                    }
                                    className="
                            rounded-lg px-3 py-2 text-sm
                            border border-slate-300
                            focus:outline-none
                            focus:ring-2 focus:ring-sky-500
                        "
                                />
                            </div>

                            {/* DÍAS DE MORA */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Días en mora
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ej: 45"
                                    value={newObligacion.diasmora}
                                    onChange={(e) =>
                                        setNewObligacion({
                                            ...newObligacion,
                                            diasmora: e.target.value,
                                        })
                                    }
                                    className="
                            rounded-lg px-3 py-2 text-sm
                            border border-slate-300
                            focus:outline-none
                            focus:ring-2 focus:ring-sky-500
                        "
                                />
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="rounded-lg bg-sky-50 border border-sky-100 p-3">
                            <p className="text-xs text-sky-700">
                                Verifique que la información sea correcta antes de guardar.
                            </p>
                        </div>

                    </div>
                </ModalBody>

                <ModalFooter>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="light"
                            size="sm"
                            typeStyle="ghost"
                            onClick={() => closeModal("nuevaObligacion")}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="info"
                            size="sm"
                            typeStyle="solid"
                            onClick={crearObligacion}
                            disabled={creating || !newObligacion.obligacion || !newObligacion.capital}
                            className="disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {creating ? "Guardando..." : "Guardar obligación"}
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default Proceso;
