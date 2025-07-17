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
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useIsAuthenticated } from "@/store/auth";
import { useAuth } from "@/hooks/useAuth";
import PhoneInput from "react-native-phone-number-input";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    phoneInput,
    showDatePicker,
    setShowDatePicker,
    showPassword,
    setShowPassword,
  } = useAuth();

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

  const handleEmailPasswordLogin = () => {
    // Handle email/password login logic here
    console.log("Email/Password login");
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
                        <View className="mb-4">
                          {authState.method === "phone" ? (
                            <View className="mb-6">
                              <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                                Phone number
                              </Text>
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
                                    },
                                  });
                                }}
                                onChangeText={(text: string) => {
                                  updateAuthState({
                                    credentials: {
                                      ...authState.credentials,
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
                            </View>
                          ) : (
                            <View className="mb-4">
                              <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                                Email address
                              </Text>
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
                            </View>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          disabled={
                            isLoading ||
                            (authState.method === "email" &&
                              !authState.credentials.email.trim()) ||
                            (authState.method === "phone" &&
                              !authState.credentials.phone.trim())
                          }
                          className={`bg-primary rounded-xl py-4 mb-8 ${
                            isLoading ||
                            (authState.method === "email" &&
                              !authState.credentials.email.trim()) ||
                            (authState.method === "phone" &&
                              !authState.credentials.phone.trim())
                              ? "opacity-50"
                              : ""
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
                            onPress={handleEmailPasswordLogin}
                            className="border-2 border-border/15 dark:border-border/30 rounded-xl p-4 bg-white dark:bg-card-dark"
                          >
                            <View className="flex-row items-center justify-center relative">
                              <View className="absolute left-0">
                                <Ionicons
                                  name="mail"
                                  size={24}
                                  color={
                                    colorScheme === "dark" ? "white" : "black"
                                  }
                                />
                              </View>
                              <Text className="text-center flex-1 text-lg text-foreground dark:text-white">
                                Continue with Email & Password
                              </Text>
                            </View>
                          </TouchableOpacity>
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
                        className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center`}
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
                        <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                          OTP pin
                        </Text>
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
                          className={`border-2 border-border/15 dark:border-border/30 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base`}
                        />
                      </View>

                      <TouchableOpacity
                        onPress={handleVerifyOtp}
                        disabled={
                          isLoading ||
                          !authState.otp ||
                          authState.otp.length !== 6
                        }
                        className={`bg-primary rounded-xl py-4 mb-6 shadow-lg $ ${
                          !authState.otp || authState.otp.length !== 6
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
                    <View className="flex-row items-center justify-between p-6 border-b border-border/15 dark:border-border/50">
                      <TouchableOpacity
                        onPress={() => updateAuthState({ step: "otp" })}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Ionicons
                          name="arrow-back"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      </TouchableOpacity>
                      <Text className="text-2xl font-bold text-foreground dark:text-white">
                        Finish signing up
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowAuthModal(false);
                          resetAuth();
                        }}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Ionicons
                          name="close"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-6 py-4">
                      <View className="mb-8">
                        <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                          Legal name
                        </Text>
                        <View className="border-2 border-border/15 dark:border-border/30 rounded-xl bg-white dark:bg-card-dark">
                          <TextInput
                            placeholder="First name on ID"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.first_name}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  first_name: text,
                                },
                              })
                            }
                            className="px-4 py-4 text-foreground dark:text-white text-base"
                            style={{
                              borderBottomWidth: 1,
                              borderBottomColor:
                                colorScheme === "dark" ? "#333" : "#e5e7eb",
                            }}
                          />
                          <TextInput
                            placeholder="Last name on ID"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.last_name}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  last_name: text,
                                },
                              })
                            }
                            className="px-4 py-4 text-foreground dark:text-white text-base"
                          />
                        </View>
                        <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark mt-2">
                          Make sure this matches the name on your government ID.
                        </Text>
                      </View>

                      <View className="mb-8">
                        <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                          Date of birth
                        </Text>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(true)}
                          className="border-2 border-border/15 dark:border-border/30 rounded-xl px-4 py-4 bg-white dark:bg-card-dark"
                        >
                          <Text className="text-base text-foreground dark:text-white">
                            {authState.profile.date_of_birth
                              ? authState.profile.date_of_birth
                              : "Select your birthday"}
                          </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                          <DateTimePicker
                            value={
                              authState.profile.date_of_birth
                                ? new Date(authState.profile.date_of_birth)
                                : new Date(2000, 0, 1)
                            }
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={(event, selectedDate) => {
                              setShowDatePicker(false);
                              if (selectedDate) {
                                updateAuthState({
                                  profile: {
                                    ...authState.profile,
                                    date_of_birth: selectedDate
                                      .toISOString()
                                      .slice(0, 10),
                                  },
                                });
                              }
                            }}
                          />
                        )}
                        <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark mt-2">
                          To sign up, you need to be at least 18. Other people
                          who use ClicknChow won't see your birthday.
                        </Text>
                      </View>

                      <View className="mb-8">
                        <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                          {authState.method === "phone" ? "Email" : "Phone"}
                        </Text>
                        {authState.method === "phone" ? (
                          <TextInput
                            placeholder="Email"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.email || ""}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  email: text,
                                },
                              })
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="border-2 border-border/15 dark:border-border/30 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base"
                          />
                        ) : (
                          <View className="border-2 border-border/15 dark:border-border/30 rounded-xl bg-white dark:bg-card-dark">
                            <PhoneInputComponent
                              ref={phoneInput}
                              defaultValue={
                                authState.profile.phone_number || ""
                              }
                              defaultCode="ZW"
                              layout="second"
                              onChangeFormattedText={(text: string) => {
                                updateAuthState({
                                  profile: {
                                    ...authState.profile,
                                    phone_number: text,
                                  },
                                });
                              }}
                              withDarkTheme={colorScheme === "dark"}
                              containerStyle={{
                                borderRadius: 0,
                                borderWidth: 0,
                                backgroundColor: "transparent",
                                width: "100%",
                                paddingHorizontal: 0,
                              }}
                              textContainerStyle={{
                                borderRadius: 0,
                                backgroundColor: "transparent",
                                paddingVertical: 16,
                              }}
                              textInputStyle={{
                                color: colorScheme === "dark" ? "#fff" : "#111",
                                fontSize: 16,
                                paddingVertical: 0,
                              }}
                              codeTextStyle={{
                                color: colorScheme === "dark" ? "#fff" : "#111",
                                fontWeight: "bold",
                              }}
                            />
                          </View>
                        )}
                        <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark mt-2">
                          {authState.method === "phone"
                            ? "We'll email you a reservation confirmation."
                            : "We'll text you a reservation confirmation."}
                        </Text>
                      </View>

                      <View className="mb-8">
                        <Text className="text-lg font-semibold text-foreground dark:text-white mb-4">
                          Password
                        </Text>
                        <View className="relative">
                          <TextInput
                            placeholder="Password"
                            placeholderTextColor={
                              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                            }
                            value={authState.profile.password || ""}
                            onChangeText={(text) =>
                              updateAuthState({
                                profile: {
                                  ...authState.profile,
                                  password: text,
                                },
                              })
                            }
                            secureTextEntry={!showPassword}
                            className="border-2 border-border/15 dark:border-border/30 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-card-dark text-base pr-16"
                          />
                          <TouchableOpacity
                            className="absolute right-4 top-4 bottom-4 justify-center"
                            onPress={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            <Text className="text-foreground dark:text-white font-semibold">
                              {showPassword ? "Hide" : "Show"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View className="mb-8">
                        <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                          By selecting{" "}
                          <Text className="font-semibold text-foreground dark:text-white">
                            Agree and continue
                          </Text>
                          , I agree to ClicknChow's{" "}
                          <Text className="underline text-foreground dark:text-white">
                            Terms of Service
                          </Text>
                          ,{" "}
                          <Text className="underline text-foreground dark:text-white">
                            Payments Terms of Service
                          </Text>{" "}
                          and{" "}
                          <Text className="underline text-foreground dark:text-white">
                            Nondiscrimination Policy
                          </Text>
                          , and acknowledge the{" "}
                          <Text className="underline text-foreground dark:text-white">
                            Privacy Policy
                          </Text>
                          .
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={handleCompleteOnboarding}
                        disabled={
                          isLoading ||
                          !authState.profile.first_name.trim() ||
                          !authState.profile.last_name.trim() ||
                          !authState.profile.date_of_birth.trim() ||
                          !authState.profile.password?.trim()
                        }
                        className={`bg-primary rounded-xl py-4 shadow-lg ${
                          isLoading ||
                          !authState.profile.first_name.trim() ||
                          !authState.profile.last_name.trim() ||
                          !authState.profile.date_of_birth.trim() ||
                          !authState.profile.password?.trim()
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
                            : "Agree and continue"}
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
