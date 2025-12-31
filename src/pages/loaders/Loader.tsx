import LogoLex from "../../assets/img/logos/logo_lex.png";

export default function LoaderLex() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-slate ">
    <div className="relative">
        {/* Círculo animado detrás (opcional) */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-600 border-t-[#1f3b58] animate-lex-spin"></div>

        {/* Logo con pulso */}
        <img
            src={LogoLex}
            alt="Lex Ex Safety"
            className="mx-auto h-40 w-auto opacity-90 animate-lex-pulse"
        />
    </div>
</div>

    );
}
