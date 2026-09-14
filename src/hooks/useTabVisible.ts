import { useEffect, useState } from "react";

export function useTabVisible(): boolean {
  const [tabVisible, setTabVisible] = useState<boolean>(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  useEffect(() => {
    const handleVisibility = () => {
      setTabVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return tabVisible;
}