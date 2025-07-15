// src/utils/authUtils.ts
interface AuthState {
  step: "login" | "otp" | "onboarding";
  method: "email" | "phone";
  credentials: {
    email: string;
    phone: string;
    phoneInputValue: string;
  };
  otp: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  termsAccepted: boolean;
  isNewAccount: boolean;
  errors: Record<string, string[]>;
}

export const initialAuthState: AuthState = {
  step: "login",
  method: "phone",
  credentials: {
    email: "",
    phone: "",
    phoneInputValue: "",
  },
  otp: "",
  profile: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  },
  termsAccepted: false,
  isNewAccount: false,
  errors: {},
};

// Validation utilities
export const validateEmail = (email: string): string[] => {
  const errors = [];
  if (!email) errors.push("Email is required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Enter a valid email address");
  return errors;
};

export const validatePhone = (phone: string): string[] => {
  const errors = [];
  if (!phone) errors.push("Phone number is required");
  else if (phone.replace(/\D/g, "").length < 8)
    errors.push("Enter a valid phone number");
  return errors;
};

export const validateOtp = (otp: string): string[] => {
  const errors = [];
  if (!otp) errors.push("OTP is required");
  else if (otp.length !== 6) errors.push("OTP must be 6 digits");
  return errors;
};

export const validateProfile = (
  profile: AuthState["profile"]
): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  if (!profile.firstName.trim()) errors.firstName = ["First name is required"];
  if (!profile.lastName.trim()) errors.lastName = ["Last name is required"];
  if (!profile.dateOfBirth.trim())
    errors.dateOfBirth = ["Date of birth is required"];
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) {
    errors.dateOfBirth = ["Enter date in YYYY-MM-DD format"];
  }

  return errors;
};

export const processDjangoErrors = (error: any): Record<string, string[]> => {
  if (!error) {
    return { nonFieldErrors: ["An unknown error occurred"] };
  }
  if (!error.response) {
    if (
      error.code === "NETWORK_ERROR" ||
      error.message?.includes("Network Error")
    ) {
      return {
        nonFieldErrors: ["Network error - please check your connection"],
      };
    }
    if (error.code === "TIMEOUT" || error.message?.includes("timeout")) {
      return { nonFieldErrors: ["Request timed out - please try again"] };
    }
    return { nonFieldErrors: ["Connection error - please try again"] };
  }

  const { status, data } = error.response;
  if (status >= 500) {
    return { nonFieldErrors: ["Server error - please try again later"] };
  }

  if (status === 401) {
    return { nonFieldErrors: ["Authentication failed - please login again"] };
  }

  if (status === 403) {
    return { nonFieldErrors: ["Access denied"] };
  }

  if (status === 429) {
    return {
      nonFieldErrors: ["Too many requests - please wait before trying again"],
    };
  }

  if (!data) {
    return { nonFieldErrors: ["Invalid response from server"] };
  }

  if (typeof data === "string") {
    return { nonFieldErrors: [data] };
  }

  if (data.detail) {
    return {
      nonFieldErrors: Array.isArray(data.detail) ? data.detail : [data.detail],
    };
  }

  if (data.non_field_errors) {
    return {
      nonFieldErrors: Array.isArray(data.non_field_errors)
        ? data.non_field_errors
        : [data.non_field_errors],
    };
  }

  const errors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(data)) {
    if (Array.isArray(messages)) {
      errors[field] = messages.filter((msg) => typeof msg === "string");
    } else if (typeof messages === "string") {
      errors[field] = [messages];
    } else if (messages && typeof messages === "object") {
      errors[field] = [JSON.stringify(messages)];
    }
  }

  if (Object.keys(errors).length === 0) {
    return { nonFieldErrors: ["An error occurred - please try again"] };
  }

  return errors;
};
