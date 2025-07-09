"use server";

import { AuthService } from "@/services/authService";

async function requestOTPAction(email?: string, phone_number?: string) {
  if (!email && !phone_number) {
    return {
      success: false,
      error: "Please provide either phone number or email",
    };
  }
  return await AuthService.requestOTP(email, phone_number);
}

async function verifyOTPAction(
  otp: string,
  email?: string,
  phone_number?: string
) {
  if (!otp || otp.toLocaleString().length !== 6) {
    return {
      success: false,
      error: "Please provide a valid the OTP",
    };
  }
  if (!email && !phone_number) {
    return {
      success: false,
      error: "Please provide either phone number or email",
    };
  }
  return await AuthService.verifyOTP(otp, email, phone_number);
}

export { requestOTPAction, verifyOTPAction };

export default function Placeholder() {
  return null;
}
