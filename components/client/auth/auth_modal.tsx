import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useIsAuthenticated } from "@/store/auth";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedInput } from "@/components/ui/animated_input";
import PhoneInput from "react-native-phone-number-input";

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal } = useIsAuthenticated();
  const PhoneInputComponent = PhoneInput as unknown as React.ComponentType<any>;
  const colorScheme = useColorScheme();
  const {
    authState,
    updateAuthState,
    resetAuth,
    sendEmailOtp,
    sendPhoneOtp,
    verifyOtp,
    completeOnboarding,
    isLoading,
  } = useAuth();

  const phoneInput = React.useRef<PhoneInput>(null);

  const handleSendOtp = () => {
    if (authState.method === "email") {
      sendEmailOtp(authState.credentials.email);
    } else {
      sendPhoneOtp(authState.credentials.phone);
    }
  };

  const handleVerifyOtp = () => {
    verifyOtp({
      method: authState.method,
      otp: authState.otp,
      email: authState.credentials.email,
      phone_number: authState.credentials.phone,
    });
  };

  const handleCompleteOnboarding = () => {
    completeOnboarding();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
  };

  const renderError = (field: string) => {
    if (!authState.errors[field]) return null;

    return (
      <View className="mt-1">
        {authState.errors[field].map((error, index) => (
          <Text key={index} className="text-red-500 text-sm">
            {error}
          </Text>
        ))}
      </View>
    );
  };

  const renderNonFieldErrors = () => {
    if (!authState.errors.nonFieldErrors) return null;

    return (
      <View className="mb-4 p-3 bg-red-100 rounded-lg">
        {authState.errors.nonFieldErrors.map((error, index) => (
          <Text key={index} className="text-red-700">
            {error}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={showAuthModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAuthModal(false);
        resetAuth();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background dark:bg-background-dark"
      >
        <View style={{ flex: 1 }}>
          {(() => {
            switch (authState.step) {
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
                          onPress={() => updateAuthState({ method: "phone" })}
                          className={`flex-1 py-4 ${
                            authState.method === "phone"
                              ? "border-b-2 border-primary"
                              : ""
                          }`}
                        >
                          <View className="flex-row items-center justify-center">
                            <Text
                              className={`ml-2 font-semibold ${
                                authState.method === "phone"
                                  ? "text-primary"
                                  : "dark:text-white"
                              }`}
                            >
                              Phone
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => updateAuthState({ method: "email" })}
                          className={`flex-1 py-4  ${
                            authState.method === "email"
                              ? "border-b-2 border-primary"
                              : " "
                          }`}
                        >
                          <View className="flex-row items-center justify-center">
                            <Text
                              className={`ml-2 font-semibold ${
                                authState.method === "email"
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
                        {renderNonFieldErrors()}
                        <View className="mb-6">
                          {authState.method === "phone" ? (
                            <>
                              <PhoneInputComponent
                                ref={phoneInput}
                                defaultValue={
                                  authState.credentials.phoneInputValue
                                }
                                defaultCode="ZW"
                                layout="second"
                                onChangeFormattedText={(text: string) => {
                                  updateAuthState({
                                    credentials: {
                                      ...authState.credentials,
                                      phone: text,
                                      phoneInputValue: text,
                                    },
                                  });
                                }}
                                withDarkTheme={colorScheme === "dark"}
                                autoFocus={true}
                                containerStyle={{
                                  borderRadius: 12,
                                  borderWidth: 1,
                                  borderColor:
                                    colorScheme === "dark" ? "#333" : "#e5e7eb",
                                  backgroundColor:
                                    colorScheme === "dark" ? "#222" : "#fff",
                                  marginBottom: 8,
                                  width: "100%",
                                  alignSelf: "center",
                                }}
                                textContainerStyle={{
                                  borderRadius: 12,
                                  backgroundColor:
                                    colorScheme === "dark" ? "#222" : "#fff",
                                }}
                                textInputStyle={{
                                  color:
                                    colorScheme === "dark" ? "#fff" : "#111",
                                  fontSize: 16,
                                  paddingVertical: 0,
                                }}
                                codeTextStyle={{
                                  color:
                                    colorScheme === "dark" ? "#fff" : "#111",
                                  fontWeight: "bold",
                                }}
                                flagButtonStyle={{
                                  borderRadius: 8,
                                }}
                              />
                              {renderError("phone_number")}
                            </>
                          ) : (
                            <>
                              <TextInput
                                placeholder="Enter your email"
                                placeholderTextColor={
                                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                                }
                                value={authState.credentials.email}
                                onChangeText={(text) =>
                                  updateAuthState({
                                    credentials: {
                                      ...authState.credentials,
                                      email: text,
                                    },
                                  })
                                }
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className={`border-2 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base border-border/15 dark:border-border/40`}
                                style={[
                                  {
                                    fontSize: 16,
                                    textAlign: "left",
                                    paddingLeft: 16,
                                  },
                                ]}
                              />
                              {renderError("email")}
                            </>
                          )}
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
                        onPress={() => updateAuthState({ step: "login" })}
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
                        onPress={() => {
                          setShowAuthModal(false);
                          resetAuth();
                        }}
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
                            {authState.method === "email"
                              ? authState.credentials.email
                              : authState.credentials.phone}
                          </Text>
                        </Text>
                      </View>

                      <View className="mb-8">
                        <TextInput
                          placeholder="Enter 6-digit code"
                          keyboardType="phone-pad"
                          maxLength={6}
                          autoFocus={true}
                          textAlign="center"
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            letterSpacing: 4,
                          }}
                          placeholderTextColor={
                            colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                          }
                          value={authState.otp}
                          onChangeText={(text) =>
                            updateAuthState({ otp: text })
                          }
                          className={`border-2 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base ${
                            authState.errors.otp
                              ? "border-destructive"
                              : "border-border/15 dark:border-border/40"
                          }`}
                        />
                        {renderError("otp")}
                      </View>

                      <TouchableOpacity
                        onPress={handleVerifyOtp}
                        disabled={isLoading}
                        className={`bg-primary rounded-xl py-4 mb-6 shadow-lg ${
                          isLoading ? "opacity-50" : ""
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
                    <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <View className="w-8" />
                      <Text className="text-xl font-bold text-foreground dark:text-white">
                        Complete Profile
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowAuthModal(false);
                          resetAuth();
                        }}
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
                      {renderNonFieldErrors()}
                      <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                          <Ionicons name="person" size={32} color="#3B82F6" />
                        </View>
                        <Text className="text-center text-gray-600 dark:text-gray-400 text-base">
                          Just a few more details to get started
                        </Text>
                      </View>

                      <View className="space-y-6">
                        <View>
                          <Text className="text-foreground dark:text-white font-semibold mb-2">
                            First Name
                          </Text>
                          <TextInput
                            placeholder="Enter first name"
                            keyboardType="default"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.firstName}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  firstName: text,
                                },
                              })
                            }
                            className={`border-2 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base ${
                              authState.errors.first_name
                                ? "border-destructive"
                                : "border-border/15 dark:border-border/40"
                            }`}
                          />
                          {renderError("first_name")}
                        </View>
                        <View>
                          <Text className="text-foreground dark:text-white font-semibold mb-2">
                            Last Name
                          </Text>
                          <TextInput
                            placeholder="Enter last name"
                            keyboardType="default"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.lastName}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  lastName: text,
                                },
                              })
                            }
                            className={`border-2 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base ${
                              authState.errors.last_name
                                ? "border-destructive"
                                : "border-border/15 dark:border-border/40"
                            }`}
                          />
                          {renderError("last_name")}
                        </View>
                        <View>
                          <Text className="text-foreground dark:text-white font-semibold mb-2">
                            Date of Birth
                          </Text>
                          <TextInput
                            placeholder="Enter date of birth (DD/MM/YYYY)"
                            keyboardType="default"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.dateOfBirth}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  dateOfBirth: text,
                                },
                              })
                            }
                            className={`border-2 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base ${
                              authState.errors.date_of_birth
                                ? "border-destructive"
                                : "border-border/15 dark:border-border/40"
                            }`}
                          />
                          {renderError("date_of_birth")}
                        </View>

                        <View className="flex-row items-start mt-6">
                          <TouchableOpacity
                            onPress={() =>
                              updateAuthState({
                                termsAccepted: !authState.termsAccepted,
                              })
                            }
                            className="mr-3 mt-1"
                          >
                            <View
                              className={`w-5 h-5 rounded border-2 items-center justify-center ${
                                authState.termsAccepted
                                  ? "bg-primary border-primary"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {authState.termsAccepted && (
                                <Ionicons
                                  name="checkmark"
                                  size={12}
                                  color="white"
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                          <Text className="flex-1 text-sm text-foreground-muted dark:text-foreground-muted-dark">
                            I agree to the{" "}
                            <Text className="text-primary font-semibold">
                              Terms of Service
                            </Text>{" "}
                            and{" "}
                            <Text className="text-primary font-semibold">
                              Privacy Policy
                            </Text>
                          </Text>
                        </View>
                        {renderError("terms")}
                      </View>

                      <TouchableOpacity
                        onPress={handleCompleteOnboarding}
                        disabled={isLoading || !authState.termsAccepted}
                        className={`bg-primary rounded-xl py-4 mt-8 shadow-lg ${
                          isLoading || isLoading || !authState.termsAccepted
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
