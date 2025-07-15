import Toast from "@/components/ui/toast";
import ToastModal from "@/components/ui/toastModal";
import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  type: ToastType;
  heading: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, heading: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (type: ToastType, heading: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, type, heading, message },
    ]);
    setToastVisible(true);
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) => {
      const newToasts = currentToasts.filter((toast) => toast.id !== id);
      if (newToasts.length === 0) {
        setToastVisible(false);
      }
      return newToasts;
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastModal
        visible={toastVisible}
        toasts={toasts}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
