import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

const OtpVerification = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    otp: "",
    pre_token: "",
    user_id: "",
  });

  const isFormValid = () => {
    return form.otp.trim();
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 bg-white">
            <View className="w-full flex flex-row">
              <TouchableOpacity
                className="w-3/4 ps-10 py-16"
                onPress={() => {
                  router.push("/signUp");
                }}
              >
                <Text className="text-primary font-semibold text-xl">
                  SIGN UP
                </Text>
              </TouchableOpacity>
              <View className="flex-1 bg-primary rounded-bl-full"></View>
            </View>
            <View className="flex mt-10 flex-col gap-4">
              <Text className="text-center text-4xl">Verify OTP</Text>
              <Text className="text-lg text-gray-dark text-center">
                Enter the OTP sent to your email to verify your account.
              </Text>
            </View>
            <View className="flex mt-10 flex-col gap-4 px-4">
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg"
                placeholder="OTP"
                placeholderTextColor="#808080"
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>
            <View className="flex flex-row justify-between mt-6">
              <TouchableOpacity className="pt-4 ps-4">
                <Text className="text-lg text-primary ms-2">Resend OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`p-6 w-44 mt-4 rounded-tl-md rounded-bl-md ${
                  isFormValid() ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <Text className="text-white text-lg text-center">Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;
