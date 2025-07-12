// src/hooks/useAuth.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/config/environments";
import { useIsAuthenticated } from "@/store/auth";
import {
  initialAuthState,
  validateEmail,
  validatePhone,
  validateOtp,
  validateProfile,
  processDjangoErrors,
} from "@/utils/auth";
import {
  sendOTPWIthEmailAction,
  sendOTPWithPhoneAction,
  verifyOTPAction,
} from "@/app/actions/requestOTP";

export function useAuth() {
  const [authState, setAuthState] =
    useState<typeof initialAuthState>(initialAuthState);
  const { setIsAuthenticated, setShowAuthModal } = useIsAuthenticated();

  const updateAuthState = (updates: Partial<typeof initialAuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates, errors: {} }));
  };

  const resetAuth = () => {
    setAuthState(initialAuthState);
  };

  const sendEmailOtpMutation = useMutation({
    mutationFn: async (email: string) => sendOTPWIthEmailAction(email),
    onSuccess: () => {
      updateAuthState({ step: "otp" });
    },
    onError: (error: any) => {
      if (typeof error === "string") {
        setAuthState((prev) => ({
          ...prev,
          errors: { nonFieldErrors: [error] },
        }));
      } else {
        setAuthState((prev) => ({ ...prev, errors: error }));
      }
    },
  });

  const sendPhoneOtpMutation = useMutation({
    mutationFn: async (phone: string) => sendOTPWithPhoneAction(phone),
    onSuccess: () => {
      updateAuthState({ step: "otp" });
    },
    onError: (error: any) => {
      if (typeof error === "string") {
        setAuthState((prev) => ({
          ...prev,
          errors: { nonFieldErrors: [error] },
        }));
      } else {
        setAuthState((prev) => ({ ...prev, errors: error }));
      }
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
    }) => verifyOTPAction(method, otp, email, phone_number),
    onSuccess: (data) => {

      if (data.user === null) {
        updateAuthState({ step: "onboarding", isNewAccount: true });
        console.log(data)
      } else {
        setIsAuthenticated(true);
        setShowAuthModal(false);
      }
    },
    onError: (error: any) => {
      if (typeof error === "string") {
        setAuthState((prev) => ({
          ...prev,
          errors: { nonFieldErrors: [error] },
        }));
      } else {
        setAuthState((prev) => ({ ...prev, errors: error }));
      }
    },
  });

  // Complete onboarding
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const profileErrors = validateProfile(authState.profile);
      if (Object.keys(profileErrors).length) {
        throw profileErrors;
      }

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

      try {
        const response = await axios.post(`${BASE_URL}/users/`, payload);
        return response.data;
      } catch (error) {
        const djangoErrors = processDjangoErrors(error);
        throw djangoErrors;
      }
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      resetAuth();
    },
    onError: (error: any) => {
      setAuthState((prev) => ({ ...prev, errors: error }));
    },
  });

  // Combined loading state
  const isLoading =
    sendEmailOtpMutation.isPending ||
    sendPhoneOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    completeOnboardingMutation.isPending;

  return {
    authState,
    updateAuthState,
    resetAuth,
    sendEmailOtpMutation,
    sendPhoneOtpMutation,
    verifyOtpMutation,
    completeOnboardingMutation,
    isLoading,
  };
}
