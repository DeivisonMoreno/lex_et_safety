import LogoLex from '../../assets/img/logos/logo_lex.png';
import { useNavigate } from 'react-router-dom';

export default function NotFound2() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-slate to-black px-6">
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-10 shadow-xl w-full max-w-lg text-center animate-fadeIn">

                <img
                    src={LogoLex}
                    alt="Lex Ex Safety"
                    className="mx-auto h-100 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
                />

                <h1 className="mt-6 text-4xl sm:text-6xl font-bold text-white tracking-tight">
                    Página no encontrada
                </h1>

                <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                    Lo sentimos, Lex Ex Safety no logró encontrar la pestaña que buscabas.
                </p>

                <div className="mt-8">
                    <button
                        onClick={handleBack}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-lg shadow-blue-600/20 transition-all duration-300"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </main>
    );
}
