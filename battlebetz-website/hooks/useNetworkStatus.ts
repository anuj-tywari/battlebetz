import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    type: null as string | null,
    isInternetReachable: true
  });

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const checkNetwork = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const isInternetReachable = await Network.isInternetReachableAsync();
        
        if (mounted) {
          setNetworkState({
            isConnected: networkState.isConnected,
            type: networkState.type,
            isInternetReachable: isInternetReachable ?? true
          });
        }
      } catch (error) {
        if (mounted) {
          setNetworkState(prev => ({
            ...prev,
            isConnected: false,
            isInternetReachable: false
          }));
        }
      }
    };

    // Initial check
    checkNetwork();

    // Set up periodic checks
    intervalId = setInterval(checkNetwork, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return networkState;
}