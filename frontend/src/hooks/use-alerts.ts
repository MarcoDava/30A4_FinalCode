import { useEffect, useState } from 'react';
import { getAlerts, type FireAlert } from '@/services/apiClient';

const POLL_INTERVAL_MS = 5000;

export function useAlerts(): FireAlert[] {
  const [alerts, setAlerts] = useState<FireAlert[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAlerts() {
      try {
        const data = await getAlerts();
        if (!cancelled) setAlerts(data);
      } catch {
        // backend unavailable — keep previous alerts
      }
    }

    fetchAlerts();
    const id = setInterval(fetchAlerts, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return alerts;
}
