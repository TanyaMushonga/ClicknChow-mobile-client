import React from "react";
import { Modal, View, StyleProp, ViewStyle } from "react-native";
import Toast, { ToastType } from "./toast";

interface ToastMessage {
  id: string;
  type: ToastType;
  heading: string;
  message: string;
}

interface ToastModalProps {
  visible: boolean;
  toasts: ToastMessage[];
  onClose: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

const ToastModal: React.FC<ToastModalProps> = ({
  visible,
  toasts,
  onClose,
  style,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View
        style={[
          {
            flex: 1,
            justifyContent: "flex-end",
            pointerEvents: "box-none",
          },
          style,
        ]}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            heading={toast.heading}
            message={toast.message}
            onClose={onClose}
          />
        ))}
      </View>
    </Modal>
  );
};

export default ToastModal;
