"use server";

import { BASE_URL } from "@/config/environments";
import axios from "axios";
async function requestOTPAction(email?: string, phone_number?: string) {
  if (!email && !phone_number) {
    throw new Error("Please provide either phone number or email");
  }
  try {
    const requestBody: { email?: string; phone_number?: string } = {};
    if (email) requestBody.email = email;
    if (phone_number) requestBody.phone_number = phone_number;

    const response = await axios.post(
      `${BASE_URL}/auth/send-otp/`,
      requestBody
    );

    return {
      success: true,
      data: null,
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
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
  try {
    const requestBody: {
      otp: string;
      email?: string;
      phone_number?: string;
    } = { otp };
    if (email) {
      requestBody.email = email;
    }
    if (phone_number) {
      requestBody.phone_number = phone_number;
    }

    const response = await axios.post(
      `${BASE_URL}/auth/verify-otp/`,
      requestBody
    );
    return {
      success: true,
      data: null,
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to send OTP",
        status: error.response?.status,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export { requestOTPAction, verifyOTPAction };

export default function Placeholder() {
  return null;
}
