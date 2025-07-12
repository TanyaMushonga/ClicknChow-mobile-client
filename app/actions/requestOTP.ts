"use server";

import { BASE_URL } from "@/config/environments";
import {
  processDjangoErrors,
  validateEmail,
  validateOtp,
  validatePhone,
} from "@/utils/auth";

import axios from "axios";

async function sendOTPWIthEmailAction(email: string) {
  const errors = validateEmail(email);
  if (errors.length) {
    throw new Error(errors[0]);
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/send-otp/`, {
      email,
    });
    return response.data;
  } catch (error) {
    const djangoErrors = processDjangoErrors(error);
    throw djangoErrors;
  }
}

async function sendOTPWithPhoneAction(phone: string) {
  const errors = validatePhone(phone);
  if (errors.length) {
    throw new Error(errors[0]);
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/send-otp/`, {
      phone_number: phone,
    });
    return response.data;
  } catch (error) {
    const djangoErrors = processDjangoErrors(error);
    throw djangoErrors;
  }
}

async function verifyOTPAction(
  method: "email" | "phone",
  otp: string,
  email?: string,
  phone_number?: string
) {
  const errors = validateOtp(otp);
  if (errors.length) {
    throw new Error(errors[0]);
  }

  const payload = method === "email" ? { email, otp } : { phone_number, otp };

  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-otp/`, payload);
    return response.data;
  } catch (error) {
    const djangoErrors = processDjangoErrors(error);
    throw djangoErrors;
  }
}

export { verifyOTPAction, sendOTPWIthEmailAction, sendOTPWithPhoneAction };

export default function Placeholder() {
  return null;
}
