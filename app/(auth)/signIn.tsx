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
import React, { useState } from "react";
import axios from "axios";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {};

  const isFormValid = () => {
    return email.trim() && password.trim();
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
              <Text className="text-center text-4xl">Login</Text>
              <Text className="text-lg text-gray-dark text-center">
                Login to manage patient information, streamline consultations,
                and access medical histories.
              </Text>
            </View>
            <View className="flex mt-10 flex-col gap-4 px-4">
              {error && (
                <View className="flex flex-row justify-center">
                  <Text className="text-red-500 text-center">{error}</Text>
                </View>
              )}
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg"
                placeholder="Email"
                placeholderTextColor="#808080"
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="Password"
                placeholderTextColor="#808080"
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
            <View className="flex flex-row justify-between mt-6">
              <TouchableOpacity className="pt-4 ps-4">
                <Text className="text-lg text-primary ms-2">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`p-6 w-44 mt-4 rounded-tl-md rounded-bl-md ${
                  isFormValid() ? "bg-primary" : "bg-gray-300"
                }`}
                onPress={handleLogin}
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-lg text-center">Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
