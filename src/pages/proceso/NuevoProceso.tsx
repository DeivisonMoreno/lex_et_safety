import React, { useEffect, useState } from "react";
import NavBar from "../../components/shared/Navbar";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { PlusCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { apiFetch } from "../../services/api";
import LoaderLex from "../loaders/Loader";

/* =======================
   TYPES
======================= */

interface OptionBase {
    id: number;
}

interface Cuantia extends OptionBase {
    cuantia: string;
}

interface TipoProceso extends OptionBase {
    tipo_proceso: string;
}

interface Ciudad extends OptionBase {
    ciudad: string;
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
        ciudad: Ciudad[];
        juzgado: Juzgado[];
        dependiente: Dependiente[];
        clasificacion: Clasificacion[];
    };
}

interface Departamento {
    id: number;
    departamento: string;
}
/* =======================
   FORM TYPE
======================= */

interface FormState {
    nombre1: string;
    cedula1: string;
    nombre2: string;
    cedula2: string;
    nombre3: string;
    cedula3: string;
    nombre4: string;
    cedula4: string;

    fechaRecibo: string;
    capital: string;
    cuantia: string;
    tipoProceso: string;

    numero_titulo: string;
    tipo_titulo: string;
    fecha_titulo: string;
    entidad_titulo: string;
    monto_deuda: string;
    intereses_moratorios: string;
    vencimiento_deuda: string;
    radicado: string;

    ciudad: string;
    departamento: string;
    juzgado_inicial: string;
    juzgado_conocimiento: string;
    dependiente: string;
    clasificacion: string;
    subClasificacion: string;
    subClasificacionAlterna: string;

    tipoPH: "residencial" | "comercial" | "mixta" | "no_aplica" | "";
    tipoPHDetalle: string[];

    tipoUnidad: "residencial" | "comercial" | "mixta" | "";
    tipoUnidadDetalle: string[];

    tipoPersonaRepre: "natural" | "juridica" | "";
    nombreRepre: string;
    tipoIdRepre: string;
    numeroIdRepre: string;
    telefonoRepre: string;
    celularRepre: string;
    correoRepre: string;
    direccionDomicilioRepre: string;
    direccionNotificacionRepre: string;

    nombrePH: string;
    nitPH: string;
    ciudadPH: string;
    departamentoPH: string;
    barrioPH: string;
    localidadPH: string;
    telefonoPH: string;
    celularPH: string;
    correoPH: string;
    direccionNotificacionPH: string;

    identificacionUnidad: string;
    matriculaInmobiliaria: string;
    telefonoUnidad: string;
    celularUnidad: string;
    correoUnidad: string;
    direccionDomicilioUnidad: string;
    direccionNotificacionUnidad: string;

    usuario: string;
}

/* =======================
   CONSTANTS
======================= */

const PH_OPTIONS = {
    residencial: ["Edificio", "Conjunto", "Condominio"],
    comercial: [
        "Centro comercial",
        "Oficinas",
        "Parque industrial",
        "Parque comercial",
        "Zona franca",
    ],
    mixta: [
        "Edificio",
        "Conjunto",
        "Condominio",
        "Parque industrial",
        "Centro comercial",
        "Oficinas",
        "Parque comercial",
        "Zona franca",
    ],
} as const;


const UNIDAD_OPTIONS = {
    residencial: ["Casa", "Apartamento", "Aparta-estudio"],
    comercial: ["Oficina", "Local", "Bodega"],
    mixta: [
        "Casa",
        "Apartamento",
        "Aparta-estudio",
        "Oficina",
        "Local",
        "Bodega",
    ],
} as const;

/* =======================
   TYPE GUARD
======================= */

type DepartamentoTarget = "PH" | "NORMAL";

/* =======================
   COMPONENT
======================= */

const NuevoProceso: React.FC = () => {
    const [catalogos, setCatalogos] =
        useState<DataNewProcessResponse["data"] | null>(null);

    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [departamentosPH, setDepartamentosPH] = useState<Departamento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [usuario, setUsuario] = useState("");

    /* =======================
       FORM STATE
    ======================= */

    const [form, setForm] = useState<FormState>({
        // TITULAR
        nombre1: "",
        cedula1: "",
        nombre2: "",
        cedula2: "",
        nombre3: "",
        cedula3: "",
        nombre4: "",
        cedula4: "",

        // PROCESO
        fechaRecibo: "",
        capital: "",
        cuantia: "",
        tipoProceso: "",

        // TÍTULO EJECUTIVO
        numero_titulo: "",
        tipo_titulo: "",
        fecha_titulo: "",
        entidad_titulo: "",
        monto_deuda: "",
        intereses_moratorios: "",
        vencimiento_deuda: "",
        radicado: "",

        // CLASIFICACIÓN
        ciudad: "",
        departamento: "",
        juzgado_inicial: "",
        juzgado_conocimiento: "",
        dependiente: "",
        clasificacion: "",
        subClasificacion: "",
        subClasificacionAlterna: "",


        //Tipo PH 
        tipoPH: "",
        tipoPHDetalle: [],

        tipoUnidad: "",
        tipoUnidadDetalle: [],

        tipoPersonaRepre: "",
        nombreRepre: "",
        tipoIdRepre: "",
        numeroIdRepre: "",
        telefonoRepre: "",
        celularRepre: "",
        correoRepre: "",
        direccionDomicilioRepre: "",
        direccionNotificacionRepre: "",

        nombrePH: "",
        nitPH: "",
        ciudadPH: "",
        departamentoPH: "",
        barrioPH: "",
        localidadPH: "",
        telefonoPH: "",
        celularPH: "",
        correoPH: "",
        direccionNotificacionPH: "",

        identificacionUnidad: "",
        matriculaInmobiliaria: "",
        telefonoUnidad: "",
        celularUnidad: "",
        correoUnidad: "",
        direccionDomicilioUnidad: "",
        direccionNotificacionUnidad: "",

        // METADATA
        usuario: usuario,
    });

    /* =======================
       INIT USUARIO
    ======================= */

    useEffect(() => {
        const storedUsuario = localStorage.getItem("usuario");
        if (storedUsuario) {
            setUsuario(storedUsuario);
            setForm(prev => ({ ...prev, usuario: storedUsuario }));
        }
    }, []);

    /* =======================
       FETCH CATÁLOGOS
    ======================= */

    useEffect(() => {
        const fetchData = async () => {
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
                setError(true);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* =======================
       HELPERS
    ======================= */

    const toOptions = <T extends { id: number }>(
        arr: T[] | undefined,
        labelKey: keyof T
    ) =>
        arr?.map(item => ({
            key: item.id,
            label: String(item[labelKey]),
            value: String(item.id),
        })) ?? [];

    const REQUIRED_FIELDS: (keyof typeof form)[] = [
        "nombre1",
        "cedula1",
        "fechaRecibo",
        "capital",
        "cuantia",
        "tipoProceso",
        "ciudad",
        "juzgado_inicial",
        "dependiente",
        "clasificacion",
        "subClasificacion",
        "subClasificacionAlterna",
        "radicado",
    ];

    const validarFormulario = () => {
        const camposVacios = REQUIRED_FIELDS.filter(
            field => !form[field] || String(form[field]).trim() === ""
        );

        if (form.tipoPH !== "" && form.tipoPH !== "no_aplica") {
            if (form.tipoPHDetalle.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Formulario incompleto",
                    text: "Debe seleccionar al menos una opción de Propiedad Horizontal.",
                });
                return false;
            }

            const requiredRepre = [
                "tipoPersonaRepre",
                "nombreRepre",
                "tipoIdRepre",
                "numeroIdRepre",
            ] as const;

            for (const field of requiredRepre) {
                if (!form[field]) {
                    Swal.fire({
                        icon: "warning",
                        title: "Formulario incompleto",
                        text: "Complete los datos del representante legal.",
                    });
                    return false;
                }
            }
        }

        if (camposVacios.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Formulario incompleto",
                text: "Por favor diligencie todos los campos obligatorios.",
                confirmButtonColor: "#0F4C81",
            });
            return false;
        }

        return true;
    };
    /* =======================
       HANDLERS
    ======================= */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCiudadChange =
        (target: DepartamentoTarget) =>
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                const { name, value, selectedOptions } = e.target;
                const selectedText = selectedOptions[0]?.text ?? "";

                setForm(prev => ({
                    ...prev,
                    [name]: value,
                }));

                getDeparments(selectedText, target);
            };

    /* =======================
       API ACTIONS
    ======================= */

    const guardarProceso = async () => {
        if (!validarFormulario()) return;

        try {
            setLoading(true);
            setError(false);

            const payload = { datos: { ...form } };

            const result = await apiFetch<any>(
                "/newProcess",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify(payload),
                }
            );

            if (result.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: result.message,
                    confirmButtonColor: "#0F4C81",
                });

                /* setTimeout(() => window.location.reload(), 4000); */
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message || "No fue posible crear el proceso",
                });
            }
        } catch (err) {
            console.error(err);
            setError(true);

            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error de comunicación con el servidor",
            });
        } finally {
            setLoading(false);
        }
    };

    const getDeparments = async (
        nameCity: string,
        target: DepartamentoTarget
    ) => {
        try {
            setError(false);

            const result = await apiFetch<any>(
                "/searchDepartaments",
                {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({ nameCity }),
                }
            );

            if (result.success) {
                if (target === "PH") {
                    setDepartamentosPH(result.data.departamentos);
                } else {
                    setDepartamentos(result.data.departamentos);
                }
            }
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };


    const isValidPH = (
        value: FormState["tipoPH"]
    ): value is Exclude<FormState["tipoPH"], "no_aplica" | ""> =>
        value !== "" && value !== "no_aplica";

    const handleMultiSelect = (
        field: "tipoPHDetalle" | "tipoUnidadDetalle",
        value: string,
        limit: number
    ) => {
        setForm(prev => {
            const exists = prev[field].includes(value);
            const updated = exists
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value];

            if (updated.length > limit) return prev;
            return { ...prev, [field]: updated };
        });
    };

    const handleTipoPHChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value as FormState["tipoPH"];

        setForm(prev => ({
            ...prev,
            tipoPH: value,
            tipoPHDetalle: [],
        }));
    };

    const handleTipoUnidadChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value as FormState["tipoUnidad"];

        setForm(prev => ({
            ...prev,
            tipoUnidad: value,
            tipoUnidadDetalle: [],
        }));
    };


    const buildUnificacion = (values: string[]) =>
        values.filter(v => v?.trim()).join(", ");

    if (loading) return <LoaderLex />;

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100">
            <NavBar />

            <main className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-6xl">

                    {/* CONTENEDOR PRINCIPAL */}
                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200">

                        {/* HEADER */}
                        <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-300">
                            <div className="bg-sky-100 px-3 py-3 rounded-lg">
                                <UserPlusIcon className="h-6 w-6 text-sky-700" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-semibold text-sky-700">
                                    Registro de Proceso Judicial
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Complete la información requerida para crear un nuevo proceso
                                </p>
                            </div>
                        </div>

                        {/* FORMULARIO */}
                        <div className="px-8 py-6 space-y-8">

                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                                    Identificación de propiedad horizontal
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Tipo de Propiedad Horizontal"
                                        name="tipoPH"
                                        value={form.tipoPH}
                                        onChange={handleTipoPHChange}
                                        options={[
                                            { value: "residencial", label: "Residencial" },
                                            { value: "comercial", label: "Comercial" },
                                            { value: "mixta", label: "Mixta" },
                                            { value: "no_aplica", label: "No aplica" },
                                        ]}
                                    />
                                </div>

                                {isValidPH(form.tipoPH) && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                                        {PH_OPTIONS[form.tipoPH].map(opt => (
                                            <Button
                                                type="button"
                                                key={opt}
                                                size="sm"
                                                variant={
                                                    form.tipoPHDetalle.includes(opt)
                                                        ? "info"
                                                        : "light"
                                                }
                                                onClick={() =>
                                                    handleMultiSelect(
                                                        "tipoPHDetalle",
                                                        opt,
                                                        form.tipoPH === "mixta" ? 5 : 1
                                                    )
                                                }
                                            >
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* UNIDAD */}
                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                                    Identificación Unidad
                                </h2>

                                <Select
                                    label="Tipo Unidad"
                                    value={form.tipoUnidad}
                                    onChange={handleTipoUnidadChange}
                                    options={[
                                        { value: "residencial", label: "Residencial" },
                                        { value: "comercial", label: "Comercial" },
                                        { value: "mixta", label: "Mixta" },
                                    ]}
                                />

                                {form.tipoUnidad && (
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {UNIDAD_OPTIONS[form.tipoUnidad].map(opt => (
                                            <Button
                                                key={opt}
                                                size="sm"
                                                variant={form.tipoUnidadDetalle.includes(opt) ? "info" : "light"}
                                                onClick={() => handleMultiSelect("tipoUnidadDetalle", opt, form.tipoUnidad === "mixta" ? 5 : 1)}
                                            >
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {form.tipoPH !== "no_aplica" && (
                                <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                    <h2 className="mb-4 text-sm font-semibold text-slate-700">Representante legal de la P.H</h2>

                                    <Select
                                        label="Tipo de persona"
                                        name="tipoPersonaRepre"
                                        value={form.tipoPersonaRepre}
                                        onChange={handleChange}
                                        options={[
                                            { value: "natural", label: "Natural" },
                                            { value: "juridica", label: "Jurídica" },
                                        ]}
                                    />

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <Input label="Nombre completo" name="nombreRepre" value={form.nombreRepre} onChange={handleChange} />
                                        <Select
                                            label="Tipo identificación"
                                            name="tipoIdRepre"
                                            value={form.tipoIdRepre}
                                            onChange={handleChange}
                                            options={[
                                                { value: "NIT", label: "NIT" },
                                                { value: "CC", label: "CC" },
                                                { value: "CE", label: "CE" },
                                                { value: "OTRO", label: "Otro" },
                                            ]}
                                        />
                                        <Input label="Número identificación" name="numeroIdRepre" value={form.numeroIdRepre} onChange={handleChange} />
                                        <Input label="Teléfono" name="telefonoRepre" onChange={handleChange} />
                                        <Input label="Celular" name="celularRepre" onChange={handleChange} />
                                        <Input label="Correo electrónico" name="correoRepre" onChange={handleChange} />
                                        <Input
                                            label="Dirección domicilio"
                                            name="direccionDomicilioRepre"
                                            value={form.direccionDomicilioRepre}
                                            onChange={handleChange}
                                        />

                                        <Input
                                            label="Dirección notificación"
                                            name="direccionNotificacionRepre"
                                            value={form.direccionNotificacionRepre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </section>
                            )}

                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">Descripción de la Propiedad Horizontal</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nombre P.H" name="nombrePH" value={form.nombrePH} onChange={handleChange} />
                                    <Input label="NIT P.H" name="nitPH" value={form.nitPH} onChange={handleChange} />

                                    <Select label="Ciudad" name="ciudadPH" value={form.ciudadPH} onChange={handleCiudadChange("PH")} options={toOptions(catalogos?.ciudad, "ciudad")} />

                                    <Select label="Departamento" name="departamentoPH" value={form.departamentoPH} onChange={handleChange} options={toOptions(departamentosPH, "departamento")} />

                                    <Input label="Barrio" name="barrioPH" value={form.barrioPH} onChange={handleChange} />
                                    <Input label="Localidad" name="localidadPH" value={form.localidadPH} onChange={handleChange} />

                                    <Input label="Teléfono" name="telefonoPH" onChange={handleChange} />
                                    <Input label="Celular" name="celularPH" onChange={handleChange} />
                                    <Input label="Correo electrónico" name="correoPH" onChange={handleChange} />
                                </div>

                                <div className="mt-4 text-xs text-slate-600">
                                    <strong>Unificación ubicación:</strong>{" "}
                                    {buildUnificacion([
                                        form.ciudadPH,
                                        form.departamentoPH,
                                        form.barrioPH,
                                        form.localidadPH
                                    ])}
                                </div>
                            </section>

                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">Descripción de la Unidad</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nombre P.H" value={form.nombrePH} disabled />
                                    <Input label="Ciudad" value={form.ciudadPH} disabled />
                                    <Input label="Departamento" value={form.departamentoPH} disabled />
                                    <Input label="Barrio" value={form.barrioPH} disabled />
                                    <Input label="Localidad" value={form.localidadPH} disabled />

                                    <Input label="Identificación unidad" name="identificacionUnidad" value={form.identificacionUnidad} onChange={handleChange} />
                                    <Input label="Matrícula inmobiliaria" name="matriculaUnidad" onChange={handleChange} />
                                    <Input label="Teléfono" name="telefonoUnidad" onChange={handleChange} />
                                    <Input label="Celular" name="celularUnidad" onChange={handleChange} />
                                    <Input label="Correo electrónico" name="correoUnidad" onChange={handleChange} />
                                    <Input label="Dirección domicilio" name="direccionDomicilioUnidad" onChange={handleChange} />
                                    <Input label="Dirección notificación" name="direccionNotificacionPH" onChange={handleChange} />
                                </div>

                                <div className="mt-4 text-xs text-slate-600">
                                    <strong>Unificación ubicación unidad:</strong>{" "}
                                    {buildUnificacion([
                                        form.ciudadPH,
                                        form.departamentoPH,
                                        form.barrioPH,
                                        form.localidadPH,
                                        form.direccionDomicilioUnidad,
                                        form.direccionNotificacionPH,
                                    ])}
                                </div>
                            </section>




                            {/* ================= DATOS TITULAR ================= */}
                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                                    Datos del titular
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Nombre 1" name="nombre1" required value={form.nombre1} onChange={handleChange} />
                                    <Input label="Cédula 1" name="cedula1" required value={form.cedula1} onChange={handleChange} />
                                    <Input label="Nombre 2" name="nombre2" value={form.nombre2} onChange={handleChange} />
                                    <Input label="Cédula 2" name="cedula2" value={form.cedula2} onChange={handleChange} />
                                    <Input label="Nombre 3" name="nombre3" value={form.nombre3} onChange={handleChange} />
                                    <Input label="Cédula 3" name="cedula3" value={form.cedula3} onChange={handleChange} />
                                    <Input label="Nombre 4" name="nombre4" value={form.nombre4} onChange={handleChange} />
                                    <Input label="Cédula 4" name="cedula4" value={form.cedula4} onChange={handleChange} />
                                </div>
                            </section>

                            {/* ================= DATOS PROCESO ================= */}
                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                                    Datos del proceso
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <Input
                                        label="Fecha de recibo"
                                        type="date"
                                        name="fechaRecibo"
                                        required
                                        value={form.fechaRecibo}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Capital"
                                        type="number"
                                        name="capital"
                                        required
                                        value={form.capital}
                                        onChange={handleChange}
                                    />

                                    <Select
                                        label="Cuantía"
                                        name="cuantia"
                                        required
                                        value={form.cuantia}
                                        onChange={handleChange}
                                        options={toOptions(catalogos?.cuantia, "cuantia")}
                                    />

                                    <Select
                                        label="Tipo de proceso"
                                        name="tipoProceso"
                                        required
                                        value={form.tipoProceso}
                                        onChange={handleChange}
                                        options={toOptions(catalogos?.tipo_proceso, "tipo_proceso")}
                                    />

                                    <Input
                                        label="Número del título ejecutivo"
                                        name="numero_titulo"
                                        value={form.numero_titulo}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Tipo de título"
                                        name="tipo_titulo"
                                        value={form.tipo_titulo}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Fecha del título"
                                        type="date"
                                        name="fecha_titulo"
                                        value={form.fecha_titulo}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Entidad que emitió el título"
                                        name="entidad_titulo"
                                        value={form.entidad_titulo}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Monto total de la deuda"
                                        type="number"
                                        name="monto_deuda"
                                        value={form.monto_deuda}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Intereses moratorios"
                                        type="number"
                                        name="intereses_moratorios"
                                        value={form.intereses_moratorios}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Vencimiento de la deuda"
                                        type="date"
                                        name="vencimiento_deuda"
                                        value={form.vencimiento_deuda}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Número de radicado"
                                        type="text"
                                        name="radicado"
                                        value={form.radicado}
                                        onChange={handleChange}
                                        maxLength={23}
                                    />

                                </div>
                            </section>

                            {/* ================= CLASIFICACIÓN ================= */}
                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                                    Estado procesal
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <Select
                                        label="Ciudad"
                                        name="ciudad"
                                        value={form.ciudad}
                                        onChange={handleCiudadChange("NORMAL")}
                                        options={toOptions(catalogos?.ciudad, "ciudad")}
                                    />
                                    <Select
                                        label="Departamento"
                                        name="departamento"
                                        required
                                        value={form.departamento}
                                        onChange={handleChange}
                                        options={toOptions(departamentos, "departamento")}
                                    />

                                    <Select
                                        label="Juzgado Inicial"
                                        name="juzgado_inicial"
                                        required
                                        value={form.juzgado_inicial}
                                        onChange={
                                            handleChange
                                        }
                                        options={toOptions(catalogos?.juzgado, "juzgado")}
                                    />

                                    <Select
                                        label="Juzgado Conocimiento"
                                        name="juzgado_conocimiento"
                                        required
                                        value={form.juzgado_conocimiento}
                                        onChange={
                                            handleChange
                                        }
                                        options={toOptions(catalogos?.juzgado, "juzgado")}
                                    />

                                    <Select
                                        label="Dependiente"
                                        name="dependiente"
                                        required
                                        value={form.dependiente}
                                        onChange={handleChange}
                                        options={toOptions(catalogos?.dependiente, "dependiente")}
                                    />

                                    <Select
                                        label="Clasificación"
                                        name="clasificacion"
                                        required
                                        value={form.clasificacion}
                                        onChange={handleChange}
                                        options={toOptions(catalogos?.clasificacion, "nombre")}
                                    />

                                    <Select
                                        label="Sub clasificación"
                                        name="subClasificacion"
                                        required
                                        value={form.subClasificacion}
                                        onChange={handleChange}
                                        options={toOptions(catalogos?.clasificacion, "nombre")}
                                    />

                                    <Select
                                        label="Sub clasificación alterna"
                                        name="subClasificacionAlterna"
                                        required
                                        value={form.subClasificacionAlterna}
                                        onChange={handleChange}
                                        options={toOptions(catalogos?.clasificacion, "nombre")}
                                    />
                                </div>
                            </section>

                            {/* NOTA OBLIGATORIEDAD */}
                            <p className="text-[11px] text-slate-400">
                                Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                            </p>

                            {/* ================= ACCIONES ================= */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                                <Button
                                    variant="dark"
                                    size="sm"
                                    typeStyle="outline"
                                    className="cursor-pointer"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="info"
                                    size="sm"
                                    typeStyle="outline"
                                    type="button"
                                    rightIcon={PlusCircleIcon}
                                    className="cursor-pointer"
                                    onClick={guardarProceso}
                                >
                                    Crear Proceso
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NuevoProceso;
