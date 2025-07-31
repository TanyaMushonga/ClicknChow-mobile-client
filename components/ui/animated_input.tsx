import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TextStyle,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

interface AnimatedInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  maxLength?: number;
  autoFocus?: boolean;
  icon?: any;
  style?: TextStyle;
  textAlign?: "left" | "center" | "right";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export const AnimatedInput = ({
  control,
  name,
  placeholder,
  keyboardType = "default",
  maxLength,
  autoFocus = false,
  icon,
  style,
  textAlign = "left",
  autoCapitalize = "none",
}: AnimatedInputProps) => {
  const colorScheme = useColorScheme();
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorHeight = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showError = () => {
    Animated.parallel([
      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(errorHeight, {
        toValue: 25,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideError = () => {
    Animated.parallel([
      Animated.timing(errorOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(errorHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        // Trigger animations when error state changes
        useEffect(() => {
          if (error) {
            shake();
            showError();
          } else {
            hideError();
          }
        }, [error]);

        return (
          <View>
            <Animated.View
              style={[
                {
                  transform: [{ translateX: shakeAnimation }],
                },
              ]}
            >
              <View className="relative">
                <TextInput
                  placeholder={placeholder}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType={keyboardType}
                  maxLength={maxLength}
                  autoFocus={autoFocus}
                  autoCapitalize={autoCapitalize}
                  className={`border-2 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base ${
                    error
                      ? "border-destructive dark:border-destructive/70"
                      : "border-border/15 dark:border-border/40"
                  }`}
                  style={[
                    {
                      fontSize: 16,
                      textAlign: textAlign,
                      paddingLeft: icon ? 50 : 16,
                    },
                    style,
                  ]}
                />
                {icon && (
                  <View className="absolute left-4 top-4">
                    <Ionicons
                      name={icon}
                      size={20}
                      color={
                        error
                          ? "#EF4444"
                          : colorScheme === "dark"
                          ? "#9CA3AF"
                          : "#6B7280"
                      }
                    />
                  </View>
                )}
              </View>
            </Animated.View>
            <Animated.View
              style={{
                height: errorHeight,
                opacity: errorOpacity,
                overflow: "hidden",
              }}
            >
              <Text className="text-destructive dark:text-destructive/70 text-sm mt-1 ml-1">
                {error?.message}
              </Text>
            </Animated.View>
          </View>
        );
      }}
    />
  );
};
