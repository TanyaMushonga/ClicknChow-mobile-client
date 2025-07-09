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
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useIsAuthenticated } from "@/store/auth";
import { useAuthModal } from "@/hooks/useAuth";

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal } = useIsAuthenticated();
  const colorScheme = useColorScheme();
  const {
    authStep,
    setAuthStep,
    loginMethod,
    setLoginMethod,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    otp,
    setOtp,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    dateOfBirth,
    setDateOfBirth,
    isNewAccount,
    isLoading,
    resetAuthModal,
    handleSendOtp,
    handleVerifyOtp,
    handleCompleteOnboarding,
    handleSocialLogin,
  } = useAuthModal();

  return (
    <Modal
      visible={showAuthModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAuthModal(false);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background dark:bg-background-dark"
      >
        <View style={{ flex: 1 }}>
          {(() => {
            switch (authStep) {
              case "login":
                return (
                  <View className="flex-1">
                    <View className="flex-col items-start gap-6 justify-between p-4">
                      <TouchableOpacity
                        onPress={() => setShowAuthModal(false)}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Ionicons
                          name="close"
                          size={28}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      </TouchableOpacity>
                      <Text className="text-2xl font-bold text-foreground dark:text-white">
                        Login or sign up to ClicknChow
                      </Text>
                    </View>

                    <ScrollView className="flex-1">
                      <View className="flex-row mb-8 border-b-2 border-border/15 dark:border-border/50">
                        <TouchableOpacity
                          onPress={() => setLoginMethod("phone")}
                          className={`flex-1 py-4 ${
                            loginMethod === "phone"
                              ? "border-b-2 border-primary"
                              : ""
                          }`}
                        >
                          <View className="flex-row items-center justify-center">
                            <Text
                              className={`ml-2 font-semibold ${
                                loginMethod === "phone"
                                  ? "text-primary"
                                  : "dark:text-white"
                              }`}
                            >
                              Phone
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setLoginMethod("email")}
                          className={`flex-1 py-4  ${
                            loginMethod === "email"
                              ? "border-b-2 border-primary"
                              : " "
                          }`}
                        >
                          <View className="flex-row items-center justify-center">
                            <Text
                              className={`ml-2 font-semibold ${
                                loginMethod === "email"
                                  ? "text-primary"
                                  : "dark:text-white"
                              }`}
                            >
                              Email
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View className="px-4">
                        <View className="mb-6">
                          <View className="relative">
                            <TextInput
                              placeholder={
                                loginMethod === "phone"
                                  ? "Enter your phone number"
                                  : "Enter your email address"
                              }
                              placeholderTextColor={
                                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                              }
                              value={
                                loginMethod === "phone" ? phoneNumber : email
                              }
                              onChangeText={
                                loginMethod === "phone"
                                  ? setPhoneNumber
                                  : setEmail
                              }
                              keyboardType={
                                loginMethod === "phone"
                                  ? "phone-pad"
                                  : "email-address"
                              }
                              className="border border-border/15 dark:border-border/40 rounded-xl px-4 py-4 text-foreground dark:text-white bg-card dark:bg-card-dark text-base"
                              autoCapitalize="none"
                              style={{
                                fontSize: 16,
                              }}
                            />
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          disabled={isLoading}
                          className={`bg-primary rounded-xl py-4 mb-8 ${
                            isLoading ? "opacity-50" : ""
                          }`}
                        >
                          <Text className="text-white text-center font-bold text-lg">
                            {isLoading ? "Sending OTP..." : "Continue"}
                          </Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center mb-8">
                          <View className="flex-1 h-px bg-border/35 dark:bg-border-60" />
                          <Text className="px-4 text-foreground-muted dark:text-foreground-muted-dark font-medium">
                            Or
                          </Text>
                          <View className="flex-1 h-px bg-border/35 dark:bg-border-60" />
                        </View>
                        <View className="flex flex-col gap-4">
                          <TouchableOpacity
                            onPress={() => handleSocialLogin("google")}
                            className="bg-foreground border rounded-xl p-4"
                          >
                            <View className="flex-row items-center justify-center relative">
                              <View className="absolute left-0">
                                <AntDesign
                                  name="google"
                                  size={24}
                                  color="white"
                                />
                              </View>
                              <Text className="text-center flex-1 text-white text-lg">
                                Continue with Google
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleSocialLogin("facebook")}
                            className="border-2 border-primary/35 rounded-xl p-4"
                          >
                            <View className="flex-row items-center justify-center relative">
                              <View className="absolute left-0">
                                <Entypo
                                  name="facebook"
                                  size={24}
                                  color={"#ff5a3c"}
                                />
                              </View>
                              <Text className="text-center flex-1 text-lg text-primary">
                                Continue with Facebook
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                );

              case "otp":
                return (
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between p-6 border-b border-border/15 dark:border-border/50">
                      <TouchableOpacity
                        onPress={() => setAuthStep("login")}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
                      >
                        <Ionicons
                          name="arrow-back"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      </TouchableOpacity>
                      <Text className="text-2xl font-bold text-foreground dark:text-white">
                        Verify Code
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowAuthModal(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
                      >
                        <Ionicons
                          name="close"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-1 px-6 py-8">
                      <View className="items-center mb-8">
                        <Text className="text-center text-foreground-muted dark:text-foreground-muted-dark text-lg px-4">
                          We've sent a 6-digit verification code to{"\n"}
                          <Text className="font-semibold text-foreground dark:text-white">
                            {loginMethod === "phone" ? phoneNumber : email}
                          </Text>
                        </Text>
                      </View>

                      <View className="mb-8">
                        <TextInput
                          placeholder="Enter 6-digit code"
                          placeholderTextColor={
                            colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                          }
                          value={otp}
                          onChangeText={setOtp}
                          keyboardType="number-pad"
                          maxLength={6}
                          className="border-2 border-border/15 dark:border-border/50 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-center text-2xl font-bold tracking-widest"
                          autoFocus
                        />
                      </View>

                      <TouchableOpacity
                        onPress={handleVerifyOtp}
                        disabled={isLoading || otp.length !== 6}
                        className={`bg-primary rounded-xl py-4 mb-6 shadow-lg ${
                          isLoading || otp.length !== 6 ? "opacity-50" : ""
                        }`}
                        style={{
                          shadowColor: "#3B82F6",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 8,
                        }}
                      >
                        <Text className="text-white text-center font-bold text-base">
                          {isLoading ? "Verifying..." : "Verify Code"}
                        </Text>
                      </TouchableOpacity>

                      <View className="items-center">
                        <Text className="dark:text-white mb-2">
                          Didn't receive the code?
                        </Text>
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          className="py-2 px-4"
                        >
                          <Text className="text-primary font-semibold">
                            Resend Code
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );

              case "onboarding":
                return (
                  <View className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <View className="w-8" />
                      <Text className="text-xl font-bold text-foreground dark:text-white">
                        Complete Profile
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowAuthModal(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
                      >
                        <Ionicons
                          name="close"
                          size={18}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-6 py-8">
                      {/* Profile Icon */}
                      <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                          <Ionicons name="person" size={32} color="#3B82F6" />
                        </View>
                        <Text className="text-center text-gray-600 dark:text-gray-400 text-base">
                          Just a few more details to get started
                        </Text>
                      </View>

                      {/* Form Fields */}
                      <View className="space-y-4">
                        <View>
                          <Text className="text-foreground dark:text-white font-semibold mb-2">
                            First Name
                          </Text>
                          <View className="relative">
                            <TextInput
                              placeholder="Enter your first name"
                              placeholderTextColor={
                                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                              }
                              value={firstName}
                              onChangeText={setFirstName}
                              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-gray-800 text-base"
                              style={{
                                fontSize: 16,
                                paddingLeft: 50,
                              }}
                            />
                            <View className="absolute left-4 top-4">
                              <Ionicons
                                name="person"
                                size={20}
                                color={
                                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                                }
                              />
                            </View>
                          </View>
                        </View>

                        <View>
                          <Text className="text-foreground dark:text-white font-semibold mb-2">
                            Last Name
                          </Text>
                          <View className="relative">
                            <TextInput
                              placeholder="Enter your last name"
                              placeholderTextColor={
                                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                              }
                              value={lastName}
                              onChangeText={setLastName}
                              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-gray-800 text-base"
                              style={{
                                fontSize: 16,
                                paddingLeft: 50,
                              }}
                            />
                            <View className="absolute left-4 top-4">
                              <Ionicons
                                name="person"
                                size={20}
                                color={
                                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                                }
                              />
                            </View>
                          </View>
                        </View>

                        <View>
                          <Text className="text-foreground dark:text-white font-semibold mb-2">
                            Date of Birth
                          </Text>
                          <View className="relative">
                            <TextInput
                              placeholder="YYYY-MM-DD"
                              placeholderTextColor={
                                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                              }
                              value={dateOfBirth}
                              onChangeText={setDateOfBirth}
                              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-gray-800 text-base"
                              style={{
                                fontSize: 16,
                                paddingLeft: 50,
                              }}
                            />
                            <View className="absolute left-4 top-4">
                              <Ionicons
                                name="calendar"
                                size={20}
                                color={
                                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                                }
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Complete Button */}
                      <TouchableOpacity
                        onPress={handleCompleteOnboarding}
                        disabled={
                          isLoading ||
                          !firstName.trim() ||
                          !lastName.trim() ||
                          !dateOfBirth.trim()
                        }
                        className={`bg-primary rounded-xl py-4 mt-8 shadow-lg ${
                          isLoading ||
                          !firstName.trim() ||
                          !lastName.trim() ||
                          !dateOfBirth.trim()
                            ? "opacity-50"
                            : ""
                        }`}
                        style={{
                          shadowColor: "#3B82F6",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 8,
                        }}
                      >
                        <Text className="text-white text-center font-bold text-base">
                          {isLoading
                            ? "Creating Account..."
                            : "Complete Registration"}
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                );

              default:
                return null;
            }
          })()}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AuthModal;
