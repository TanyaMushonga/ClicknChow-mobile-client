import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateSouthAfricanPhoneNumber,
} from "@/utils/validators";

const SignUp = () => {
  const router = useRouter();
  const [stage, setStage] = useState(1);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
    email: "",
    password: "",
    dob: "",
  });
  const handleNext = () => {
    if (stage < 5) {
      setStage(stage + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (stage > 1) {
      setStage(stage - 1);
    }
  };

  const isCurrentStageValid = () => {
    switch (stage) {
      case 1:
        return (
          form.first_name.trim() &&
          form.last_name.trim() &&
          form.username.trim() &&
          form.dob.trim()
        );
      case 2:
        return (
          form.phone_number.trim() && form.email.trim() && form.password.trim()
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors("");
    const { email, password, phone_number, dob } = form;

    if (!validateEmail(email)) {
      setErrors("Invalid email format");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrors(
        "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters"
      );
      setLoading(false);
      return;
    }

    if (!validateSouthAfricanPhoneNumber(phone_number)) {
      setErrors("Invalid phone number format");
      setLoading(false);
      return;
    }

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setErrors("You must be at least 18 years old");
      setLoading(false);
      return;
    }

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
      const currentDate = selectedDate || new Date(form.dob);
      setShowDatePicker(false);
      setForm({
        ...form,
        dob: currentDate.toISOString().split("T")[0],
      });
    };

    const renderStage = () => {
      switch (stage) {
        case 1:
          return (
            <>
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg"
                placeholder="First Name"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, first_name: text })}
                value={form.first_name}
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="Last Name"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, last_name: text })}
                value={form.last_name}
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="Username"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, username: text })}
                value={form.username}
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="Date of birth"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, dob: text })}
                value={form.username}
                autoCapitalize="none"
              />
            </>
          );
        case 2:
          return (
            <>
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg"
                placeholder="e.g. +27831234567"
                placeholderTextColor="#808080"
                onChangeText={(text) =>
                  setForm({ ...form, phone_number: text })
                }
                value={form.phone_number}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="Email"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, email: text })}
                value={form.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="Password"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, password: text })}
                value={form.password}
                secureTextEntry
                autoCapitalize="none"
              />
            </>
          );

          return (
            <>
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg"
                placeholder="Home Language"
                placeholderTextColor="#808080"
                onChangeText={(text) =>
                  setForm({ ...form, home_language: text })
                }
                value={form.home_language}
                autoCapitalize="none"
              />
              <TextInput
                className="rounded-lg p-4 shadow-lg bg-gray-100 text-lg mt-4"
                placeholder="ID Number"
                placeholderTextColor="#808080"
                onChangeText={(text) => setForm({ ...form, id_number: text })}
                value={form.id_number}
                autoCapitalize="none"
              />
              <View className="rounded-lg shadow-lg bg-gray-100 text-lg mt-4">
                <Picker
                  selectedValue={form.sex}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, sex: itemValue })
                  }
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="MALE" />
                  <Picker.Item label="Female" value="FEMALE" />
                  <Picker.Item label="Other" value="OTHERS" />
                </Picker>
              </View>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 bg-white">
              <View className="w-full flex flex-row">
                <View className="flex-1 bg-primary rounded-br-full"></View>
                <TouchableOpacity
                  className="w-3/4 pe-10 py-16 flex items-end"
                  onPress={() => {
                    router.push("/signIn");
                  }}
                >
                  <Text className="text-primary font-semibold text-xl">
                    SIGN IN
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex mt-10 flex-col gap-4">
                <Text className="text-center text-4xl">Sign Up</Text>
                <Text className="text-lg text-gray-dark text-center">
                  Sign up to manage patient information, streamline
                  consultations, and access comprehensive medical histories.
                </Text>
              </View>
              <View className="flex mt-10 flex-col gap-4 px-4">
                {errors && (
                  <View className="flex flex-row justify-center">
                    <Text className="text-red-500 text-center">{errors}</Text>
                  </View>
                )}
                {renderStage()}
              </View>
              <View className="flex flex-row justify-between mt-8 p-4">
                {stage > 1 && (
                  <TouchableOpacity
                    className="p-6 w-44 bg-primary rounded-md"
                    onPress={handleBack}
                  >
                    <Text className="text-white text-center font-bold text-xl">
                      Back
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className={`p-6 w-44 rounded-md ${
                    isCurrentStageValid() ? "bg-primary" : "bg-gray-300"
                  }`}
                  onPress={handleNext}
                  disabled={!isCurrentStageValid() || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center font-bold text-xl">
                      {stage < 5 ? "Continue" : "Submit"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };
};

export default SignUp;
