import { BASE_URL } from "@/config/environments";
import axios from "axios";

export class AuthService {
  static async requestOTP(email?: string, phone_number?: string) {
    try {
      const requestBody: { email?: string; phone_number?: string } = {};
      if (email) {
        requestBody.email = email;
      }
      if (phone_number) {
        requestBody.phone_number = phone_number;
      }
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
        return {
          success: false,
          error: error.response?.data?.error || "Failed to send OTP",
          status: error.response?.status,
        };
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  static async verifyOTP(otp: string, email?: string, phone_number?: string) {
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
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
