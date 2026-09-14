/**
 * @dev Anuj Tiwari
 * @Created_at 15/04/2025
 * @description Matrix page Hook
 */
import { useState, useEffect } from 'react';
import { fetchPlatformMetrics, PlatformMetrics } from '@/services/metricsService';

export const usePlatformMetrics = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlatformMetrics();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return { metrics, loading, error };
};
