import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { MerchantsResponse } from "@/types";

const OrganizationAbout = ({
  organization,
}: {
  organization: MerchantsResponse;
}) => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const bgColor = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor =
    colorScheme === "dark" ? "border-gray-700" : "border-gray-200";

  const openURL = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url.startsWith("http") ? url : `https://${url}`);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const renderOpeningHours = () => {
    const days = [
      { name: "Monday", hours: organization.openingHours.monday },
      { name: "Tuesday", hours: organization.openingHours.tuesday },
      { name: "Wednesday", hours: organization.openingHours.wednesday },
      { name: "Thursday", hours: organization.openingHours.thursday },
      { name: "Friday", hours: organization.openingHours.friday },
      { name: "Saturday", hours: organization.openingHours.saturday },
      { name: "Sunday", hours: organization.openingHours.sunday },
    ];

    return days.map((day) => (
      <View
        key={day.name}
        className={`flex-row justify-between py-3 border-b border-b-border/15 dark:border-b-background-dark/15 ${borderColor}`}
      >
        <Text className={`${textColor} font-medium`}>{day.name}</Text>
        <Text className={`${textColor}`}>
          {day.hours.open === "closed" || day.hours.close === "closed"
            ? "Closed"
            : `${formatTime(day.hours.open)} - ${formatTime(day.hours.close)}`}
        </Text>
      </View>
    ));
  };

  return (
    <ScrollView className={`flex-1 ${bgColor}`}>
      <View className="mt-4 px-4">
        <View className="mb-6">
          <Text className={`text-xl font-bold mb-3 ${textColor}`}>About</Text>
          <Text className={`${textColor}`}>
            {organization.about.description}
          </Text>
        </View>

        <View className="mb-6">
          <Text className={`text-xl font-bold mb-3 ${textColor}`}>
            Contact Information
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() => Linking.openURL(`tel:${organization.about.phone}`)}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color={colorScheme === "dark" ? "white" : "gray"}
              className="mr-3"
            />
            <Text className={`${textColor}`}>{organization.about.phone}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() =>
              Linking.openURL(`mailto:${organization.about.email}`)
            }
          >
            <MaterialIcons
              name="email"
              size={20}
              color={colorScheme === "dark" ? "white" : "gray"}
              className="mr-3"
            />
            <Text className={`${textColor}`}>{organization.about.email}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() => {
              if (organization.about.website) {
                openURL(organization.about.website);
              }
            }}
            disabled={!organization.about.website}
          >
            <MaterialIcons
              name="public"
              size={20}
              color={colorScheme === "dark" ? "white" : "gray"}
              className="mr-3"
            />
            <Text className={`${textColor}`}>{organization.about.website}</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className={`text-xl font-bold mb-3 ${textColor}`}>
            Opening Hours
          </Text>
          {renderOpeningHours()}
        </View>

        {organization.about.socialMedia && (
          <View className="mb-6">
            <Text className={`text-xl font-bold mb-3 ${textColor}`}>
              Follow Us
            </Text>
            <View className="flex-row">
              {organization.about.socialMedia?.facebook && (
                <TouchableOpacity
                  className="mr-4"
                  onPress={() =>
                    openURL(organization.about.socialMedia?.facebook!)
                  }
                >
                  <FontAwesome
                    name="facebook"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "#3b5998"}
                  />
                </TouchableOpacity>
              )}
              {organization.about.socialMedia?.instagram && (
                <TouchableOpacity
                  className="mr-4"
                  onPress={() =>
                    openURL(organization.about.socialMedia?.instagram!)
                  }
                >
                  <FontAwesome
                    name="instagram"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "#e1306c"}
                  />
                </TouchableOpacity>
              )}
              {organization.about.socialMedia?.twitter && (
                <TouchableOpacity
                  onPress={() =>
                    openURL(organization.about.socialMedia?.twitter!)
                  }
                >
                  <FontAwesome
                    name="twitter"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "#1da1f2"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View className="mb-6">
          <Text className={`text-md text-foreground-muted dark:text-foreground-muted-dark mb-2`}>
            Member since{" "}
            {new Date(organization.about.dateJoined).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrganizationAbout;
