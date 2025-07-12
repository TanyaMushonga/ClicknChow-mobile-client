import { useState, useCallback } from "react";

interface ToastConfig {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  position?: "top" | "bottom";
  showCloseButton?: boolean;
}

interface ToastState extends ToastConfig {
  visible: boolean;
  id: string;
}

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
    duration: 4000,
    position: "top",
    showCloseButton: true,
    id: "",
  });

  const showToast = useCallback((config: ToastConfig) => {
    const id = Date.now().toString();
    setToastState({
      ...config,
      visible: true,
      id,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (message: string, options?: Partial<ToastConfig>) => {
      showToast({
        message,
        type: "success",
        ...options,
      });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, options?: Partial<ToastConfig>) => {
      showToast({
        message,
        type: "error",
        ...options,
      });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options?: Partial<ToastConfig>) => {
      showToast({
        message,
        type: "warning",
        ...options,
      });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options?: Partial<ToastConfig>) => {
      showToast({
        message,
        type: "info",
        ...options,
      });
    },
    [showToast]
  );

  return {
    toastState,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
