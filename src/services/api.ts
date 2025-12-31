import { API_URL } from "../config/env";
import { authStorage } from "./authStorage";

interface FetchOptions extends RequestInit {
    auth?: boolean;
}

export const apiFetch = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {})
    };

    if (options.auth) {
        const token = authStorage.getToken();
        if (token) {
            headers["x-token"] = token;
        }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
};
