// Common API types used across client and server

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  field_errors?: Record<string, string[]>;
  non_field_errors?: string[];
  detail?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  new_password: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

// Utility type for handling form validation errors
export interface FormErrors {
  [key: string]: string[];
}

// Helper function to extract field errors from ApiError
export const extractFieldErrors = (error: ApiError): FormErrors => {
  return error.field_errors || {};
};

// Helper function to extract non-field errors from ApiError
export const extractNonFieldErrors = (error: ApiError): string[] => {
  return error.non_field_errors || [];
};

// Helper function to get the first error message
export const getFirstErrorMessage = (error: ApiError): string => {
  if (error.field_errors) {
    const firstFieldError = Object.values(error.field_errors)[0];
    if (Array.isArray(firstFieldError) && firstFieldError.length > 0) {
      return firstFieldError[0];
    }
  }

  if (error.non_field_errors && error.non_field_errors.length > 0) {
    return error.non_field_errors[0];
  }

  return error.message || "An error occurred";
};

// Helper function to check if error is a validation error
export const isValidationError = (error: ApiError): boolean => {
  return (
    error.status === 400 && (!!error.field_errors || !!error.non_field_errors)
  );
};

// Helper function to check if error is an authentication error
export const isAuthError = (error: ApiError): boolean => {
  return error.status === 401;
};

// Helper function to check if error is a permission error
export const isPermissionError = (error: ApiError): boolean => {
  return error.status === 403;
};

// Helper function to check if error is a not found error
export const isNotFoundError = (error: ApiError): boolean => {
  return error.status === 404;
};

// Helper function to check if error is a server error
export const isServerError = (error: ApiError): boolean => {
  return error.status >= 500;
};

// Helper function to format validation errors for display
export const formatValidationErrors = (errors: FormErrors): string => {
  const errorMessages: string[] = [];

  Object.entries(errors).forEach(([field, messages]) => {
    messages.forEach((message) => {
      errorMessages.push(`${field}: ${message}`);
    });
  });

  return errorMessages.join("\n");
};

// Helper function to create a user-friendly error message
export const createUserFriendlyErrorMessage = (error: ApiError): string => {
  if (isValidationError(error)) {
    if (error.field_errors) {
      return formatValidationErrors(error.field_errors);
    }
    if (error.non_field_errors) {
      return error.non_field_errors.join("\n");
    }
  }

  if (isAuthError(error)) {
    return "Authentication failed. Please check your credentials and try again.";
  }

  if (isPermissionError(error)) {
    return "You do not have permission to perform this action.";
  }

  if (isNotFoundError(error)) {
    return "The requested resource was not found.";
  }

  if (isServerError(error)) {
    return "Server error. Please try again later.";
  }

  return error.message || "An unexpected error occurred.";
};
