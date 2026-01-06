import { API_URL } from "../config/env";
import { authStorage } from "./authStorage";

interface FetchOptions extends RequestInit {
    auth?: boolean;
}

export const apiFetch = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {

    const headers = new Headers(options.headers || {});

    if (options.auth) {
        const token = authStorage.getToken();
        if (token) {
            headers.set("x-token", token);
        }
    }

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
    }

    return res.json() as Promise<T>;
};


export const apiFetchBlob = async (
    endpoint: string,
    options: RequestInit & { auth?: boolean } = {}
): Promise<Blob> => {
    const headers = new Headers(options.headers || {});

    if (options.auth) {
        const token = authStorage.getToken();
        if (token) {
            headers.set("x-token", token);
        }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        throw new Error(`Error descargando archivo (${res.status})`);
    }

    return res.blob();
};


