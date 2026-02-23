import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "token";

export const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = Boolean(localStorage.getItem(TOKEN_KEY));
  /* const isAuthenticated = true; */

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  return {
    isAuthenticated,
    login,
    logout,
  };
};
