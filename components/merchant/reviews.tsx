import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { MerchantsResponse } from "@/types";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount?: number;
}

interface ReviewsAndRatingsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  onAddReview?: () => void;
}

const ReviewsAndRatings = ({
  organization,
}: {
  organization: MerchantsResponse;
}) => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const bgColor = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor =
    colorScheme === "dark" ? "border-gray-700" : "border-gray-200";

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={20}
            color={star <= rating ? "#facc15" : "#d1d5db"}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView className={`flex-1 ${bgColor} p-4`}>
      {/* Rating Summary */}
      <View
        className={`mb-6 p-4 rounded-lg ${
          colorScheme === "dark" ? "bg-gray-700" : "bg-gray-50"
        }`}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className={`text-2xl font-bold ${textColor}`}>
            {organization.rating.toFixed(1)}
          </Text>
          <View>
            {renderStars(Math.round(organization.rating))}
            <Text className={`text-gray-500 dark:text-gray-400 mt-1`}>
              {organization.numberOfRatings} {organization.numberOfRatings === 1 ? "review" : "reviews"}
            </Text>
          </View>
        </View>

        {/* Rating Breakdown */}
        <View className="mt-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = (organization?.reviews ?? []).filter(
              (r) => Math.round(r.rating) === rating
            ).length;
            const percentage = (count / organization.numberOfRatings) * 100;

            return (
              <View key={rating} className="flex-row items-center mb-2">
                <Text className={`w-8 ${textColor}`}>{rating}</Text>
                <Ionicons name="star" size={16} color="#facc15" />
                <View className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-yellow-500"
                    style={{ width: `${percentage}%` }}
                  />
                </View>
                <Text className={`text-sm ${textColor}`}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Add Review Button */}
      <TouchableOpacity
        className={`mb-6 p-3 rounded-lg flex-row items-center justify-center border ${borderColor}`}
      
      >
        <Ionicons
          name="create-outline"
          size={20}
          color={colorScheme === "dark" ? "white" : "gray"}
          className="mr-2"
        />
        <Text className={`${textColor} font-medium`}>Write a Review</Text>
      </TouchableOpacity>

      {/* Reviews List */}
      <View>
        <Text className={`text-xl font-bold mb-4 ${textColor}`}>
          Customer Reviews
        </Text>

        {(organization?.reviews ?? []).length === 0 ? (
          <Text className={`${textColor} text-center py-8`}>
            No reviews yet. Be the first to review!
          </Text>
        ) : (
          (organization?.reviews ?? []).map((review) => (
            <View
              key={review.id}
              className={`mb-6 pb-4 border-b ${borderColor}`}
            >
              <View className="flex-row items-center mb-3">
                {review.userImage ? (
                  <Image
                    source={{ uri: review.userImage }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center">
                    <Ionicons
                      name="person"
                      size={20}
                      color={colorScheme === "dark" ? "white" : "gray"}
                    />
                  </View>
                )}
                <View>
                  <Text className={`font-medium ${textColor}`}>
                    {review.userName}
                  </Text>
                  <View className="flex-row items-center">
                    {renderStars(review.rating)}
                    <Text
                      className={`text-xs text-gray-500 dark:text-gray-400 ml-2`}
                    >
                      {formatDate(review.date)}
                    </Text>
                  </View>
                </View>
              </View>

              <Text className={`${textColor} mb-3`}>{review.comment}</Text>

              {review.helpfulCount !== undefined && (
                <View className="flex-row items-center">
                  <Text
                    className={`text-sm text-gray-500 dark:text-gray-400 mr-2`}
                  >
                    {review.helpfulCount} people found this helpful
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-sm text-blue-500">Helpful</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewsAndRatings;
