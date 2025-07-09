import { requestOTPAction, verifyOTPAction } from "@/app/actions/requestOTP";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

const completeOnboardingApi = async (payload: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
}) => {
  const response = await fetch("/api/complete-onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to complete registration");
  return data;
};

export function useAuthModal() {
  const [authStep, setAuthStep] = useState("login");
  const [loginMethod, setLoginMethod] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);

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

  const sendOtpMutation = useMutation({
    mutationFn: (payload: { email?: string; phone?: string }) =>
      requestOTPAction(payload.email, payload.phone),
    onSuccess: () => {
      setAuthStep("otp");
    },
    onError: (error: Error) => Alert.alert("Error", error.message),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: { otp: string; email?: string; phone?: string }) =>
      verifyOTPAction(payload.otp, payload.email, payload.phone),
    onSuccess: (data) => {
      if (data.success) setAuthStep("onboarding");
    },
    onError: (error: Error) => Alert.alert("Error", error.message),
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: completeOnboardingApi,
    onSuccess: (data) => {
      // Auth completed
    },
    onError: (error: Error) => Alert.alert("Error", error.message),
  });

  const handleSendOtp = () => {
    if (loginMethod === "phone" && !phoneNumber.trim()) {
      return Alert.alert("Error", "Please enter your phone number");
    }
    if (loginMethod === "email" && !email.trim()) {
      return Alert.alert("Error", "Please enter your email address");
    }
    sendOtpMutation.mutate({
      phone: loginMethod === "phone" ? phoneNumber : undefined,
      email: loginMethod === "email" ? email : undefined,
    });
  };

  const handleVerifyOtp = () => {
    if (!otp?.toLocaleString().trim()) {
      return Alert.alert("Error", "Please enter the OTP");
    }
    verifyOtpMutation.mutate({
      otp,
      phone: loginMethod === "phone" ? phoneNumber : undefined,
      email: loginMethod === "email" ? email : undefined,
    });
  };

  const handleCompleteOnboarding = () => {
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth.trim()) {
      return Alert.alert("Error", "Please fill in all fields");
    }
    completeOnboardingMutation.mutate({
      firstName,
      lastName,
      dateOfBirth,
      phone: loginMethod === "phone" ? phoneNumber : undefined,
      email: loginMethod === "email" ? email : undefined,
    });
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "twitter"
  ) => {
    console.log(`Logging in with ${provider}`);
    setTimeout(() => {}, 1000);
  };

  return {
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
    isLoading:
      sendOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      completeOnboardingMutation.isPending,
    resetAuthModal,
    handleSendOtp,
    handleVerifyOtp,
    handleCompleteOnboarding,
    handleSocialLogin,
  };
}
