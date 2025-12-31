import Swal from 'sweetalert2';

const baseConfig = {
    background: '#17324B',              // Azul corporativo
    color: '#E5E7EB',                   // Texto claro
    confirmButtonColor: '#E3C15A',      // Dorado Lex
    confirmButtonText: 'Aceptar',
    allowOutsideClick: false,
};

export const useAlert = () => {
    const success = (title: string, text?: string) =>
        Swal.fire({
            ...baseConfig,
            icon: 'success',
            title,
            text,
            iconColor: '#22C55E', // verde éxito
        });

    const error = (title: string, text?: string) =>
        Swal.fire({
            ...baseConfig,
            icon: 'error',
            title,
            text,
            iconColor: '#EF4444', // rojo error
        });

    const warning = (title: string, text?: string) =>
        Swal.fire({
            ...baseConfig,
            icon: 'warning',
            title,
            text,
            iconColor: '#F59E0B', // ámbar advertencia
        });

    const info = (title: string, text?: string) =>
        Swal.fire({
            ...baseConfig,
            icon: 'info',
            title,
            text,
            iconColor: '#38BDF8', // azul informativo
        });

    return {
        success,
        error,
        warning,
        info,
    };
};
