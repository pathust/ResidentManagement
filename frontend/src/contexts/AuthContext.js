'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, locationAPI } from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [ethnicities, setEthnicities] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const utilManager = async () => {
      if (user) {
        if (provinces.length === 0) {
          const provincesData = await locationAPI.getAllProvinces();
          setProvinces(provincesData);
        }

        if (ethnicities.length === 0) {
          const ethnicitiesData = await locationAPI.getAllEthnicities();
          setEthnicities(ethnicitiesData);
        }
      }
    };

    utilManager();
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);

      localStorage.setItem("user", JSON.stringify({ username }));

      setUser({ username });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}