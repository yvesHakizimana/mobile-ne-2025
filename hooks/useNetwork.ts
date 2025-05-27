import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  connectionType: string;
}

export function useNetwork() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: false,
    isInternetReachable: false,
    connectionType: 'unknown',
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        connectionType: state.type,
      });
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        connectionType: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return networkState;
}