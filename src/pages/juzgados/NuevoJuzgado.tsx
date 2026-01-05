import React, { useState } from "react";
import NavBar from "../../components/shared/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { apiFetch } from "../../services/api";

/* =======================
   COMPONENT
======================= */

const NuevoJuzgado: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nombre_juzgado: "",
        correo: "",
        telefono: "",
        direccion: "",
    });

    /* =======================
       HANDLERS
    ======================= */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
        const camposVacios = Object.values(form).some(
            v => !v || v.trim() === ""
        );

        if (camposVacios) {
            Swal.fire({
                icon: "warning",
                title: "Formulario incompleto",
                text: "Por favor diligencie todos los campos.",
                confirmButtonColor: "#0F4C81",
            });
            return false;
        }

        return true;
    };

    /* =======================
       ACTION
    ======================= */

    const guardarJuzgado = async () => {
        if (!validarFormulario()) return;

        try {
            setLoading(true);

            const payload = {
                datos: {
                    ...form,
                },
            };

            const result = await apiFetch<any>(
                "/nuevoJuzgado",
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
                    text: result.message || "Juzgado creado correctamente",
                    confirmButtonColor: "#0F4C81",
                });

                setForm({
                    nombre_juzgado: "",
                    correo: "",
                    telefono: "",
                    direccion: "",
                });
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message || "No fue posible crear el juzgado",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error de comunicación con el servidor",
            });
        } finally {
            setLoading(false);
        }
    };

    /* =======================
       RENDER
    ======================= */

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100">
            <NavBar />

            <main className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200">

                        {/* HEADER */}
                        <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-200">
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <BuildingLibraryIcon className="h-6 w-6 text-sky-700" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-sky-700">
                                    Crear un nuevo juzgado
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Complete la información requerida
                                </p>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input
                                label="Nombre del juzgado"
                                name="nombre_juzgado"
                                value={form.nombre_juzgado}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Correo electrónico"
                                name="correo"
                                type="email"
                                value={form.correo}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Teléfono"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Dirección"
                                name="direccion"
                                value={form.direccion}
                                onChange={handleChange}
                                required
                                className="md:col-span-2"
                            />
                        </div>

                        {/* FOOTER */}
                        <div className="px-8 py-4 border-t border-slate-200 flex justify-end">
                            <Button
                                variant="info"
                                size="sm"
                                onClick={guardarJuzgado}
                                disabled={loading}
                                typeStyle="ghost"
                            >
                                {loading ? "Guardando..." : "Crear juzgado"}
                            </Button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default NuevoJuzgado;
