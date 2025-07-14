// src/hooks/useAuth.ts
import { useState } from "react";
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
import { apiPost } from "@/config/apiClient";
 

export function useAuth() {
  const [authState, setAuthState] = useState(initialAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setShowAuthModal } = useIsAuthenticated();

  const updateAuthState = (updates: Partial<typeof initialAuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates, errors: {} }));
  };

  const resetAuth = () => {
    setAuthState(initialAuthState);
  };

  const handleError = (error: any) => {
    if (typeof error === "string") {
      setAuthState((prev) => ({
        ...prev,
        errors: { nonFieldErrors: [error] },
      }));
    } else {
      setAuthState((prev) => ({ ...prev, errors: error }));
    }
  };

  const sendEmailOtp = async (email: string) => {
    try {
      const errors = validateEmail(email);
      if (errors.length) {
        throw new Error(errors[0]);
      }

      setIsLoading(true);
      await apiPost(`${BASE_URL}/auth/send-otp/`, { email });
      updateAuthState({ step: "otp" });
    } catch (error) {
      handleError(processDjangoErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async (phone: string) => {
    try {
      const errors = validatePhone(phone);
      if (errors.length) {
        throw new Error(errors[0]);
      }

      setIsLoading(true);
      await apiPost(`${BASE_URL}/auth/send-otp/`, { phone_number: phone });
      updateAuthState({ step: "otp" });
    } catch (error) {
      handleError(processDjangoErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async ({
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
    try {
      const errors = validateOtp(otp);
      if (errors.length) {
        throw new Error(errors[0]);
      }

      setIsLoading(true);
      const payload =
        method === "email" ? { email, otp } : { phone_number, otp };
      const data = await apiPost(`${BASE_URL}/auth/verify-otp/`, payload) as { user: any };

      if (data.user === null) {
        updateAuthState({ step: "onboarding", isNewAccount: true });
      } else {
        setIsAuthenticated(true);
        setShowAuthModal(false);
      }
    } catch (error) {
      handleError(processDjangoErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      const profileErrors = validateProfile(authState.profile);
      if (Object.keys(profileErrors).length) {
        throw profileErrors;
      }

      if (!authState.termsAccepted) {
        throw { nonFieldErrors: ["You must accept the terms and conditions"] };
      }

      setIsLoading(true);
      const payload = {
        first_name: authState.profile.firstName,
        last_name: authState.profile.lastName,
        date_of_birth: authState.profile.dateOfBirth,
        ...(authState.method === "email"
          ? { email: authState.credentials.email }
          : { phone_number: authState.credentials.phone }),
      };

      await apiPost(`${BASE_URL}/users/`, payload);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      resetAuth();
    } catch (error) {
      handleError(processDjangoErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authState,
    updateAuthState,
    resetAuth,
    sendEmailOtp,
    sendPhoneOtp,
    verifyOtp,
    completeOnboarding,
    isLoading,
  };
}
