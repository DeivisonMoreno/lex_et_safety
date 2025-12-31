const TOKEN_KEY = "token";
const USER_KEY = "usuario";
const USER_ID_KEY = "idUsuario";

export const authStorage = {
    setSession: (token: string, usuario: string, idUsuario: number) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, usuario);
        localStorage.setItem(USER_ID_KEY, String(idUsuario));
    },

    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_ID_KEY);
    },

    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};
