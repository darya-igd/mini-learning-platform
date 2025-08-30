import React, { createContext, useContext, useEffect, useState } from "react";

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };

  useEffect(() => {
    
  }, []);

  return <AuthCtx.Provider value={{ token, setToken }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
