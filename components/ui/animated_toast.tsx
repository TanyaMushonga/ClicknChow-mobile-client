import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

interface ToastProps {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onHide?: () => void;
  position?: "top" | "bottom";
  showCloseButton?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type,
  duration = 4000,
  onHide,
  position = "top",
  showCloseButton = true,
}) => {
  const colorScheme = useColorScheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getToastStyles = () => {
    const baseStyles = "mx-4 rounded-2xl shadow-lg border-l-4 backdrop-blur-sm";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-500 shadow-green-500/20`;
      case "error":
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-500 shadow-red-500/20`;
      case "warning":
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 shadow-yellow-500/20`;
      case "info":
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-blue-500/20`;
      default:
        return baseStyles;
    }
  };

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      case "info":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      case "warning":
        return "text-yellow-800 dark:text-yellow-200";
      case "info":
        return "text-blue-800 dark:text-blue-200";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  if (!visible) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: position === "top" ? [-100, 0] : [100, 0],
  });

  return (
    <View
      className={`absolute left-0 right-0 z-50 ${
        position === "top" ? "top-12" : "bottom-12"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateY }, { scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <View className={getToastStyles()}>
          <View className="flex-row items-center p-4">
            {/* Icon */}
            <View className="mr-3">
              <Ionicons name={getIconName()} size={24} color={getIconColor()} />
            </View>

            {/* Message */}
            <View className="flex-1">
              <Text className={`font-medium text-base ${getTextColor()}`}>
                {message}
              </Text>
            </View>

            {/* Close Button */}
            {showCloseButton && (
              <TouchableOpacity
                onPress={hideToast}
                className="ml-3 p-1 rounded-full"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Toast;
