// src/config/env.ts
declare global {
    interface Window {
        __ENV__?: {
            API_URL?: string;
        };
    }
}

export const API_URL: string =
    window.__ENV__?.API_URL ||
    import.meta.env.VITE_API_URL ||
    "";

if (!API_URL) {
    console.warn("⚠️ API_URL no está definida");
}
