import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useColorScheme,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import LastOrder from "@/components/last-order";
import TrendingNearYou from "@/components/treding-near-you";
import Search from "@/components/search";
import DealsAndCombos from "@/components/deals&combos";
import GroceriesAndEssentials from "@/components/Groceries&Essentials";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RecommendedForYou from "@/components/RecommendedForYou";
import MerchantsCloseBy from "@/components/merchantsCloseBy";
import FeaturedToday from "@/components/FeaturedToday";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const Home = () => {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showMapButton, setShowMapButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const colorScheme = useColorScheme();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState("login"); // 'login', 'otp', 'onboarding'
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone', 'email'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Replace with your actual authentication check
    try {
      // const token = await AsyncStorage.getItem('authToken');
      // setIsAuthenticated(!!token);
      // For demo purposes, set to false to show modal
      setIsAuthenticated(false);
      if (!isAuthenticated) {
        setShowAuthModal(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setShowAuthModal(true);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScroll = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;

        setShowMapButton(currentScroll > 100);
        setIsAtBottom(currentScroll + layoutHeight >= contentHeight - 20);
      },
      useNativeDriver: false,
    }
  );

  const handleSendOtp = async () => {
    if (loginMethod === "phone" && !phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (loginMethod === "email" && !email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual OTP API call
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [loginMethod]: loginMethod === "phone" ? phoneNumber : email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAuthStep("otp");
        setIsNewAccount(data.isNewAccount);
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual OTP verification API call
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [loginMethod]: loginMethod === "phone" ? phoneNumber : email,
          otp,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (isNewAccount) {
          setAuthStep("onboarding");
        } else {
          // Existing user, complete authentication
          setIsAuthenticated(true);
          setShowAuthModal(false);
          // Save token to storage
          // await AsyncStorage.setItem('authToken', data.token);
        }
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual onboarding API call
      const response = await fetch("/api/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          [loginMethod]: loginMethod === "phone" ? phoneNumber : email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        // Save token to storage
        // await AsyncStorage.setItem('authToken', data.token);
      } else {
        Alert.alert("Error", data.message || "Failed to complete registration");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "twitter"
  ) => {
    setIsLoading(true);
    try {
      // Replace with your actual social login implementation
      console.log(`Logging in with ${provider}`);
      // For demo purposes, simulate successful login
      setTimeout(() => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert("Error", `Failed to login with ${provider}`);
      setIsLoading(false);
    }
  };

  const resetAuthModal = () => {
    setAuthStep("login");
    setPhoneNumber("");
    setEmail("");
    setOtp("");
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setIsNewAccount(false);
  };

  const renderAuthContent = () => {
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
                    loginMethod === "phone" ? "border-b-2 border-primary" : ""
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
                    loginMethod === "email" ? "border-b-2 border-primary" : " "
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
                      value={loginMethod === "phone" ? phoneNumber : email}
                      onChangeText={
                        loginMethod === "phone" ? setPhoneNumber : setEmail
                      }
                      keyboardType={
                        loginMethod === "phone" ? "phone-pad" : "email-address"
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
                        <AntDesign name="google" size={24} color="white" />
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
                        <Entypo name="facebook" size={24} color={"#ff5a3c"} />
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
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={() => setAuthStep("login")}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
              >
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-foreground dark:text-white">
                Verify Code
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

            <View className="flex-1 px-6 py-8">
              {/* OTP Icon */}
              <View className="items-center mb-8">
                <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                  <Ionicons name="lock-closed" size={32} color="#3B82F6" />
                </View>
                <Text className="text-center text-gray-600 dark:text-gray-400 text-base px-4">
                  We've sent a 6-digit verification code to{"\n"}
                  <Text className="font-semibold text-foreground dark:text-white">
                    {loginMethod === "phone" ? phoneNumber : email}
                  </Text>
                </Text>
              </View>

              {/* OTP Input */}
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
                  className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-foreground dark:text-white bg-white dark:bg-gray-800 text-center text-2xl font-bold tracking-widest"
                  autoFocus
                />
              </View>

              {/* Verify Button */}
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

              {/* Resend Section */}
              <View className="items-center">
                <Text className="text-gray-500 dark:text-gray-400 mb-2">
                  Didn't receive the code?
                </Text>
                <TouchableOpacity onPress={handleSendOtp} className="py-2 px-4">
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
                        color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
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
                        color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
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
                        color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
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
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="px-3 pb-5"
      >
        <View className="flex-col gap-4">
          <Search />
          <FeaturedToday />
          <LastOrder />
          <RecommendedForYou />
          <TrendingNearYou />
          <MerchantsCloseBy />
          <GroceriesAndEssentials />
          <DealsAndCombos />
        </View>
      </ScrollView>

      {showMapButton && !isAtBottom && (
        <Animated.View
          className="absolute bottom-4 left-0 right-0 items-center"
          style={{
            opacity: scrollY.interpolate({
              inputRange: [100, 150],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [100, 150],
                  outputRange: [20, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/storemap")}
            className="bg-foreground dark:bg-background py-2 px-3 rounded-full shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="map"
                size={20}
                color={colorScheme === "dark" ? "#000" : "#fff"}
              />
              <Text className="text-white dark:text-foreground font-medium ml-2">
                View Map
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Authentication Modal */}
      <Modal
        visible={showAuthModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          if (authStep === "login") {
            setShowAuthModal(false);
          } else {
            resetAuthModal();
          }
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 bg-background dark:bg-background-dark"
        >
          <View className="flex-1">{renderAuthContent()}</View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Home;
