import React, { useState, useEffect } from 'react';
import { create } from 'zustand';

interface ErrorState {
  message: string | null;
  setMessage: (message: string | null) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  message: null,
  setMessage: (message) => set({ message }),
}));

const ErrorNotification: React.FC = () => {
  const { message, setMessage } = useErrorStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50">
      <p>{message}</p>
      <button onClick={() => setMessage(null)} className="ml-2 font-bold">
        &times;
      </button>
    </div>
  );
};

export default ErrorNotification;
