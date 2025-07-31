import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import Feather from "@expo/vector-icons/Feather";

const PaymentMethods = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon
            name="arrow-left"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold dark:text-white">
          Add Payment Method
        </Text>
        <View className="w-10" />
      </View>
      <View className="p-4 bg-background dark:bg-background-dark flex-1">
        <View className="mb-4">
          <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
            Cardholder Name
          </Text>
          <TextInput
            className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
            placeholder="John Doe"
          />
        </View>

        <View className="mb-4">
          <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
            Card Number
          </Text>
          <TextInput
            className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
              Expiry Date
            </Text>
            <TextInput
              className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
              CVV
            </Text>
            <TextInput
              className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View className="bg-warning/15 border border-warning dark:border-warning rounded-lg px-2 py-4 mb-6 flex flex-row gap-2">
          <Feather name="alert-triangle" size={24} color="#FBBD23" />
          <Text className="text-warning text-md flex-1 flex-shrink">
            Your payment information is encrypted and secure. We never store
            your full card details.
          </Text>
        </View>

        <TouchableOpacity className="bg-foreground rounded-lg py-4 items-center mb-3">
          <Text className="text-white font-semibold">Add Payment Method</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethods;
