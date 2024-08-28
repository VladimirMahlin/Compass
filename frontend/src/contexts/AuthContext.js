import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async (retries = 3) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/checksession",
        {
          withCredentials: true,
        },
      );
      if (response.data.isLoggedIn) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check session:", error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => checkSession(retries - 1), 1000);
        return;
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};
