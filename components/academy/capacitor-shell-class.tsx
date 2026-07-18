"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

export function CapacitorShellClass() {
  useEffect(() => {
    const isCapacitor =
      Capacitor.isNativePlatform() ||
      window.location.protocol === "capacitor:" ||
      navigator.userAgent.includes("Capacitor");

    document.documentElement.classList.toggle("capacitor-shell", isCapacitor);

    return () => {
      document.documentElement.classList.remove("capacitor-shell");
    };
  }, []);

  return null;
}
