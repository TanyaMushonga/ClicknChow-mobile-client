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
    first_name: string;
    last_name: string;
    date_of_birth: string;
    email: string;
    phone_number: string;
    password: string;
  };
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
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    password: "",
  },
};

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

  if (!profile.first_name.trim())
    errors.first_name = ["First name is required"];
  if (!profile.last_name.trim()) errors.last_name = ["Last name is required"];
  if (!profile.date_of_birth.trim())
    errors.date_of_birth = ["Date of birth is required"];
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.date_of_birth)) {
    errors.date_of_birth = ["Enter date in YYYY-MM-DD format"];
  }

  if (!profile.email.trim()) {
    errors.email = ["Email is required"];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = ["Enter a valid email address"];
  }

  if (!profile.password.trim()) {
    errors.password = ["Password is required"];
  } else {
    const passwordErrors = [];
    if (profile.password.length < 8) {
      passwordErrors.push(" Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(profile.password)) {
      passwordErrors.push(
        " Password must contain at least one lowercase letter"
      );
    }
    if (!/(?=.*[A-Z])/.test(profile.password)) {
      passwordErrors.push(
        " Password must contain at least one uppercase letter"
      );
    }
    if (!/(?=.*\d)/.test(profile.password)) {
      passwordErrors.push(" Password must contain at least one number");
    }
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
  }

  return errors;
};
