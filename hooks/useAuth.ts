import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/config/environments";
import { useIsAuthenticated } from "@/store/auth";
import {
  initialAuthState,
  validateEmail,
  validatePhone,
  validateOtp,
  validateProfile,
} from "@/utils/auth";
import { apiPost, CustomApiError } from "@/config/apiClient";
import { useToast } from "@/provider/ToastProvider";

export function useAuth() {
  const [authState, setAuthState] = useState(initialAuthState);
  const { setIsAuthenticated, setShowAuthModal } = useIsAuthenticated();
  const { showToast } = useToast();

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
      showToast("success", "OTP Sent", "An OTP has been sent to your email.");
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

  // --- Phone OTP Mutation ---
  const sendPhoneOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      const errors = validatePhone(phone);
      if (errors.length) throw new Error(errors[0]);
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

  // --- OTP Verification Mutation ---
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
    onSuccess: (data: any) => {
      if (data.user === null) {
        updateAuthState({ step: "onboarding", isNewAccount: true });
      } else {
        setIsAuthenticated(true);
        setShowAuthModal(false);
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

  // --- Onboarding Mutation ---
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const profileErrors = validateProfile(authState.profile);
      if (Object.keys(profileErrors).length) throw profileErrors;
      if (!authState.termsAccepted) {
        throw { nonFieldErrors: ["You must accept the terms and conditions"] };
      }
      const payload = {
        first_name: authState.profile.firstName,
        last_name: authState.profile.lastName,
        date_of_birth: authState.profile.dateOfBirth,
        ...(authState.method === "email"
          ? { email: authState.credentials.email }
          : { phone_number: authState.credentials.phone }),
      };
      await apiPost(`${BASE_URL}/users/`, payload);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      resetAuth();
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
  };
}
