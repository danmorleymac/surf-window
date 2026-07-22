import { useEffect, useState } from "react";
import { getHealth } from "../lib/api-client";

type ApiStatus = "checking" | "healthy" | "unavailable";

export function BackendStatus() {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    async function checkHealth(): Promise<void> {
      try {
        const result = await getHealth();
        setStatus(result.status === "ok" ? "healthy" : "unavailable");
      } catch {
        setStatus("unavailable");
      }
    }

    void checkHealth();
  }, []);

  return (
    <section>
      <h2>Backend status</h2>

      {status === "checking" && <p>Checking API…</p>}
      {status === "healthy" && <p>Healthy</p>}
      {status === "unavailable" && <p>Unavailable</p>}
    </section>
  );
}
