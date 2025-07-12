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

// Error handling for Django REST Framework responses
export const processDjangoErrors = (error: any): Record<string, string[]> => {
  if (!error.response)
    return { nonFieldErrors: ["Network error - please try again"] };

  const { data } = error.response;

  if (typeof data === "string") {
    return { nonFieldErrors: [data] };
  }

  if (data.detail) {
    return { nonFieldErrors: [data.detail] };
  }

  if (data.non_field_errors) {
    return { nonFieldErrors: data.non_field_errors };
  }

  // Handle field errors (convert from DRF format to our format)
  const errors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(data)) {
    if (Array.isArray(messages)) {
      errors[field] = messages;
    } else if (typeof messages === "string") {
      errors[field] = [messages];
    }
  }

  return errors;
};
