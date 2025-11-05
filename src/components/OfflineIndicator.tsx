import React from 'react';
import { useNetworkStore } from '../stores/networkStore';

const OfflineIndicator: React.FC = () => {
  const isOnline = useNetworkStore((state) => state.isOnline);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center p-2">
      You are currently offline. Some features may be unavailable.
    </div>
  );
};

export default OfflineIndicator;
