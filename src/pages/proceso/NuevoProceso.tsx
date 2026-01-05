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
        sub_clasificacion: Clasificacion[];
        sub_clasificacion_alterna: Clasificacion[];
    };
}

interface Departamento {
    id: number;
    departamento: string;
}

/* =======================
   COMPONENT
======================= */

const NuevoProceso: React.FC = () => {
    const [catalogos, setCatalogos] =
        useState<DataNewProcessResponse["data"] | null>(null);

    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [usuario, setUsuario] = useState("");

    /* =======================
       FORM STATE
    ======================= */

    const [form, setForm] = useState({
        // TITULAR
        nombre1: "",
        cedula1: "",
        nombre2: "",
        cedula2: "",

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

        // CLASIFICACIÓN
        ciudad: "",
        departamento: "",
        juzgado: "",
        dependiente: "",
        clasificacion: "",
        subClasificacion: "",
        subClasificacionAlterna: "",

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
        "juzgado",
        "dependiente",
        "clasificacion",
        "subClasificacion",
        "subClasificacionAlterna",
    ];

    const validarFormulario = () => {
        const camposVacios = REQUIRED_FIELDS.filter(
            field => !form[field] || String(form[field]).trim() === ""
        );

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

    const handleCiudadChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value, selectedOptions } = e.target;
        const selectedText = selectedOptions[0]?.text ?? "";

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        getDeparments(selectedText);
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

                setTimeout(() => window.location.reload(), 4000);
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

    const getDeparments = async (nameCity: string) => {
        try {
            setLoading(true);
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
                setDepartamentos(result.data.departamentos);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

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

                                </div>
                            </section>

                            {/* ================= CLASIFICACIÓN ================= */}
                            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                                    Clasificación judicial
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <Select
                                        label="Ciudad"
                                        name="ciudad"
                                        required
                                        value={form.ciudad}
                                        onChange={handleCiudadChange}
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
                                        label="Juzgado"
                                        name="juzgado"
                                        required
                                        value={form.juzgado}
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
