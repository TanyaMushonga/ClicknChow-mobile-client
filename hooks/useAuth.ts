import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/config/environments";
import { useIsAuthenticated } from "@/store/auth";
import {
  initialAuthState,
  validateEmail,
  validateOtp,
  validateProfile,
} from "@/utils/auth";
import { apiPost, CustomApiError } from "@/config/apiClient";
import { useToast } from "@/provider/ToastProvider";
import { setTokens, setUserData } from "@/utils/token_storage";
import PhoneInput from "react-native-phone-number-input";

export function useAuth() {
  const [authState, setAuthState] = useState(initialAuthState);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { setIsAuthenticated, login } = useIsAuthenticated();
  const { showToast } = useToast();
  const phoneInput = useRef<PhoneInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const updateAuthState = (updates: Partial<typeof initialAuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates, errors: {} }));
  };

  const resetAuth = () => {
    setAuthState(initialAuthState);
  };

  const sendEmailOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const errors = validateEmail(email);
      if (errors.length) throw new Error(errors[0]);
      await apiPost(`${BASE_URL}/auth/send-otp/`, { email });
    },
    onSuccess: () => {
      updateAuthState({ step: "otp" });
    },
    onError: (error: any) => {
      showToast(
        "error",
        "Error",
        error instanceof CustomApiError
          ? error.message
          : error?.message || "An error occurred while sending OTP."
      );
    },
  });

  const sendPhoneOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      const isValidPhone = phoneInput.current?.isValidNumber(phone);
      if (!isValidPhone) throw new Error("Please enter a valid phone number");
      await apiPost(`${BASE_URL}/auth/send-otp/`, { phone_number: phone });
    },
    onSuccess: () => {
      updateAuthState({ step: "otp" });
    },
    onError: (error: any) => {
      showToast(
        "error",
        "Error",
        error instanceof CustomApiError
          ? error.message
          : error?.message || "An error occurred while sending OTP."
      );
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({
      method,
      otp,
      email,
      phone_number,
    }: {
      method: "email" | "phone";
      otp: string;
      email: string;
      phone_number: string;
    }) => {
      const errors = validateOtp(otp);
      if (errors.length) throw new Error(errors[0]);
      const payload =
        method === "email" ? { email, otp } : { phone_number, otp };
      return apiPost(`${BASE_URL}/auth/verify-otp/`, payload);
    },
    onSuccess: async (data: any) => {
      if (data.user === null && !data.access && !data.refresh) {
        setIsAuthenticated(false);
        updateAuthState({ step: "onboarding" });
      } else if (data.access && data.refresh && data.user) {
        await setTokens(data.access, data.refresh);
        await setUserData(data.user);
        login(data.user);
        resetAuth();
      }
    },
    onError: (error: any) => {
      showToast(
        "error",
        "Error",
        error instanceof CustomApiError
          ? error.message
          : error?.message || "An error occurred while verifying OTP."
      );
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        first_name: authState.profile.first_name,
        last_name: authState.profile.last_name,
        date_of_birth: authState.profile.date_of_birth,
        email: authState.credentials.email
          ? authState.credentials.email
          : authState.profile.email,
        phone_number: authState.credentials.phone
          ? authState.credentials.phone
          : authState.profile.phone_number,
        password: authState.profile.password,
      };
      const profileErrors = validateProfile(payload);
      if (Object.keys(profileErrors).length) {
        const errorMessages = Object.values(profileErrors).join(", ");
        throw new Error(errorMessages);
      }
      const isValidPhone = phoneInput.current?.isValidNumber(
        payload.phone_number
      );
      if (!isValidPhone) throw new Error("Please enter a valid phone number");
      return await apiPost(
        `${BASE_URL}/users/`,
        payload,
        {},
        {
          headers: {
            platform: "mobile",
          },
        }
      );
    },
    onSuccess: async (data: any) => {
      if (data?.user === null && !data?.access && !data?.refresh) {
        setIsAuthenticated(false);
        updateAuthState({ step: "login" });
        showToast("success", "Onboarding Complete", "You can now log in.");
        return;
      } else if (data?.access && data?.refresh && data?.user) {
        await setUserData(data.user);
        await setTokens(data.access, data.refresh);
        login(data.user);
        resetAuth();
      }
    },
    onError: (error: any) => {
      showToast(
        "error",
        "Error",
        error instanceof CustomApiError
          ? error.message
          : error?.message || "An error occurred while completing onboarding."
      );
    },
  });

  return {
    authState,
    updateAuthState,
    resetAuth,
    sendEmailOtp: sendEmailOtpMutation.mutate,
    sendPhoneOtp: sendPhoneOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    completeOnboarding: completeOnboardingMutation.mutate,
    isLoading:
      sendEmailOtpMutation.isPending ||
      sendPhoneOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      completeOnboardingMutation.isPending,
    phoneInput,
    showDatePicker,
    setShowDatePicker,
    showPassword,
    setShowPassword,
  };
}
