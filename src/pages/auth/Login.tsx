import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoLex from "../../assets/img/logos/logo_lex.png";
import { apiFetch } from "../../services/api";
import { authStorage } from "../../services/authStorage";
import { useAuth } from "../../hooks/useAuth";
import LoaderLex from "../loaders/Loader";
import Swal from "sweetalert2";

export interface Usuario {
    id: number;
    email: string;
    usuario: string;
}

export interface LoginResponse {
    success: boolean;
    usuario: Usuario;
    token: string;
}

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const sendLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await apiFetch<LoginResponse>(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify({ username, password })
                }
            );

            if (data.success) {
                authStorage.setSession(
                    data.token,
                    data.usuario.usuario,
                    data.usuario.id
                );
                login(data.token);
                navigate("/procesos", { replace: true })
            }
        } catch (err) {
            setError("Credenciales incorrectas");
            Swal.fire({
                icon: "error",
                title: "Lo sentimos",
                text: "Credenciales incorrectas, intentelo nuevamente",
            });
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoaderLex />;
    return (
        <>
            <div className=" w-full bg-gray-900 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-3xl shadow-2xl w-100 p-8 text-center ">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <img src={LogoLex} alt="" className="h-[250px]" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Bienvenido,</h2>
                    <p className="text-gray-500 text-sm mb-6">Inicia sesión para continuar</p>

                    <form action="" method="post" className="space-y-4">
                        <div className="text-left">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de usuario</label>
                            <input type="text" name="username" required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                        </div>

                        <div className="text-left mb-5">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
                            <input type="password" name="password" required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </form>
                    <button type="submit"
                        className="w-full bg-[#134CA3] hover:bg-[#134ca3c9] text-gray-100 font-semibold py-2 rounded-lg transition cursor-pointer"
                        onClick={() => sendLogin()}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login
