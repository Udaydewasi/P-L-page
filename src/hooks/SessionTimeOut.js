// src/hooks/useSessionTimeout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

export default function useSessionTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const logout = () => {
      localStorage.removeItem("adminToken");
      navigate("/", { replace: true });
    };

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, SESSION_TIMEOUT);
    };

    // Initialize timeout
    resetTimeout();

    // Reset on user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimeout));

    return () => {
      clearTimeout(timeoutId);
      events.forEach((e) => window.removeEventListener(e, resetTimeout));
    };
  }, [navigate]);
}