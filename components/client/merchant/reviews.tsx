import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { MerchantsResponse } from "@/types";
import { Review } from "@/types/merchants";

const ReviewsAndRatings = ({
  organization,
  onAddReview,
}: {
  organization: MerchantsResponse;
  onAddReview?: (review: Omit<Review, "id" | "date" | "helpfulCount">) => void;
}) => {
  const { colorScheme } = useColorScheme();
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const isDark = colorScheme === "dark";
  const textColor = isDark ? "text-white" : "text-gray-900";

  const renderStars = (
    rating: number,
    size: number = 16,
    interactive: boolean = false,
    onPress?: (rating: number) => void
  ) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && onPress && onPress(star)}
            disabled={!interactive}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={size}
              color={star <= rating ? "#FF6B35" : "#d1d5db"}
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (organization?.reviews ?? []).forEach((review) => {
      const rating = Math.round(review.rating);
      distribution[rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleSubmitReview = () => {
    if (newRating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a rating before submitting."
      );
      return;
    }
    if (newComment.trim().length < 10) {
      Alert.alert(
        "Comment Too Short",
        "Please write at least 10 characters in your review."
      );
      return;
    }

    const review = {
      userId: "current-user-id", // Replace with actual logged in user ID
      firstName: "Current firstname",
      lastName: "Current lastName",
      rating: newRating,
      comment: newComment.trim(),
    };

    onAddReview?.(review);
    setShowAddReview(false);
    setNewRating(0);
    setNewComment("");
    Alert.alert("Success", "Your review has been submitted!");
  };

  const filteredReviews = (organization?.reviews ?? []).filter((review) => {
    if (selectedFilter === "all") return true;
    return Math.round(review.rating) === parseInt(selectedFilter);
  });

  const distribution = getRatingDistribution();
  const totalReviews = organization.numberOfRatings || 0;

  return (
    <View className={`flex-1 bg-background dark:bg-background-dark`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={`px-6 py-8 shadow-sm`}>
          <View className="flex-row items-start mb-8">
            <View className="mr-8">
              <Text className={`text-6xl font-bold ${textColor} mb-2`}>
                {organization.rating.toFixed(1)}
              </Text>
              {renderStars(Math.round(organization.rating), 20)}
              <Text className={`${textColor} mt-2 text-sm`}>
                {totalReviews.toLocaleString()}
              </Text>
            </View>
            <View className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution];
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <TouchableOpacity
                    key={rating}
                    className="flex-row items-center mb-1"
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`${textColor} text-sm font-medium w-3 text-center`}
                    >
                      {rating}
                    </Text>

                    <View className="flex-1 mx-3 h-2 bg-neutral/15 dark:bg-neutral/40 rounded-sm overflow-hidden">
                      <View
                        className="h-full bg-[#FF6B35] rounded-sm"
                        style={{
                          width: `${Math.max(
                            percentage,
                            percentage > 0 ? 3 : 0
                          )}%`,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddReview(true)}
            className="border border-border/15 dark:border-border px-6 py-3 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={isDark ? "white" : "gray"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-foreground-muted dark:text-foreground-muted-dark font-semibold text-base">
              Write a Review
            </Text>
          </TouchableOpacity>
          <View className="mt-8">
            {organization?.reviews?.slice(0, 5).map((review, index) => (
              <View
                key={review.id}
                className={`${
                  index !== filteredReviews.length - 1
                    ? `border-b border-border/15 dark:border-border/25`
                    : ""
                } py-4`}
              >
                <View className="flex-row mb-4">
                  {review.userImage ? (
                    <Image
                      source={{ uri: review.userImage }}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-neutral dark:bg-gray-600 items-center justify-center">
                      <Text className="font-bold text-white">
                        {review.firstName[0].toUpperCase()}{" "}
                        {review.lastName[0].toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className={`font-semibold ${textColor}`}>
                        {review.firstName} {review.lastName}
                      </Text>
                      <Text
                        className={`text-xs text-foreground-muted dark:text-foreground-muted-dark`}
                      >
                        {formatDate(review.date)}
                      </Text>
                    </View>
                    {renderStars(review.rating, 16)}
                  </View>
                </View>

                <Text className={`${textColor} leading-6 mb-4`}>
                  {review.comment}
                </Text>

                {review.helpfulCount !== undefined && (
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`text-sm text-foreground-muted dark:text-foreground-muted-dark`}
                    >
                      {review.helpfulCount} people found this helpful
                    </Text>
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons
                        name={
                          review.isHelpful ? "thumbs-up" : "thumbs-up-outline"
                        }
                        size={16}
                        color={review.isHelpful ? "#FF6B35" : "#9CA3AF"}
                      />
                      <Text
                        className={`text-sm ml-1 text-foreground-muted dark:text-foreground-muted-dark`}
                      >
                        Helpful
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View className="mt-5 flex flex-row items-center justify-between">
                  <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                    Was this helpful?
                  </Text>
                  <View className="flex flex-row items-center gap-4">
                    <TouchableOpacity className="border border-border px-3 py-2 rounded-md">
                      <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="border border-border px-3 py-2 rounded-md">
                      <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {(organization?.reviews?.length ?? 0) > 0 ? (
              <TouchableOpacity
                className="mt-4"
                onPress={() => setShowAllReviews(true)}
              >
                <Text className="text-primary underline font-thin">
                  Show more
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showAddReview}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className={`flex-1 bg-background dark:bg-background-dark`}>
          <View className={`px-6 py-4 border-b border-border/25`}>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setShowAddReview(false)}>
                <Text className="dark:text-white font-medium">Cancel</Text>
              </TouchableOpacity>
              <Text className={`text-lg font-semibold ${textColor}`}>
                Write Review
              </Text>
              <TouchableOpacity onPress={handleSubmitReview}>
                <Text className="dark:text-white font-medium">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 py-6">
            <View className="items-center mb-8">
              <Text className={`text-xl font-semibold ${textColor} mb-4`}>
                Rate your experience
              </Text>
              {renderStars(newRating, 40, true, setNewRating)}
              <Text
                className={`text-foreground-muted dark:text-foreground-muted-dark mt-2`}
              >
                Tap a star to rate
              </Text>
            </View>

            <View className="mb-6">
              <Text className={`text-lg font-medium ${textColor} mb-3`}>
                Share your thoughts
              </Text>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Tell others about your experience with this restaurant..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className={`${textColor} p-3 text-base bg-neutral/10 dark:bg-foreground/25 rounded-lg`}
                style={{ minHeight: 120 }}
              />
              <Text
                className={`text-sm text-foreground-muted dark:text-foreground-muted-dark mt-2`}
              >
                {newComment.length}/500 characters
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showAllReviews}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className={`flex-1 bg-background dark:bg-background-dark`}>
          <View className={`px-6 py-4 border-b border-border/25`}>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setShowAllReviews(false)}>
                <Text className="dark:text-white font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className={`px-6 py-4 border-b border-border/25`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {[
                  { key: "all", label: "All Reviews " },
                  { key: "5", label: "5 " },
                  { key: "4", label: "4 " },
                  { key: "3", label: "3 " },
                  { key: "2", label: "2 " },
                  { key: "1", label: "1 " },
                ].map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key)}
                    className={`px-4 py-2 rounded-md mr-3 border flex flex-row items-center ${
                      selectedFilter === filter.key
                        ? "bg-neutral/40 border-border/15 dark:bg-neutral/60 dark:border-border/20"
                        : `border-border/10 dark:border-border/50`
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedFilter === filter.key ? "text-white" : textColor
                      }`}
                    >
                      {filter.label}
                    </Text>
                    {filter.key !== "all" && (
                      <Ionicons
                        name={"star"}
                        size={12}
                        color={
                          isDark
                            ? "white"
                            : selectedFilter === filter.key
                            ? "white"
                            : "gray"
                        }
                        style={{ marginRight: 2 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <View className="px-4 pb-[110px]">
            <FlatList
              data={filteredReviews}
              keyExtractor={(item) => item.id}
              renderItem={({ item: review, index }) => (
                <View
                  key={review.id}
                  className={`${
                    index !== filteredReviews.length - 1
                      ? `border-b border-border/15 dark:border-border/25`
                      : ""
                  } py-4`}
                >
                  <View className="flex-row mb-4">
                    {review.userImage ? (
                      <Image
                        source={{ uri: review.userImage }}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-neutral dark:bg-gray-600 items-center justify-center">
                        <Text className="font-bold text-white">
                          {review.firstName[0].toUpperCase()}{" "}
                          {review.lastName[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className={`font-semibold ${textColor}`}>
                          {review.firstName} {review.lastName}
                        </Text>
                        <Text
                          className={`text-xs text-foreground-muted dark:text-foreground-muted-dark`}
                        >
                          {formatDate(review.date)}
                        </Text>
                      </View>
                      {renderStars(review.rating, 16)}
                    </View>
                  </View>

                  <Text className={`${textColor} leading-6 mb-4`}>
                    {review.comment}
                  </Text>

                  {review.helpfulCount !== undefined && (
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-sm text-foreground-muted dark:text-foreground-muted-dark`}
                      >
                        {review.helpfulCount} people found this helpful
                      </Text>
                      <TouchableOpacity className="flex-row items-center">
                        <Ionicons
                          name={
                            review.isHelpful ? "thumbs-up" : "thumbs-up-outline"
                          }
                          size={16}
                          color={review.isHelpful ? "#FF6B35" : "#9CA3AF"}
                        />
                        <Text
                          className={`text-sm ml-1 text-foreground-muted dark:text-foreground-muted-dark`}
                        >
                          Helpful
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View className="mt-5 flex flex-row items-center justify-between">
                    <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                      Was this helpful?
                    </Text>
                    <View className="flex flex-row items-center gap-4">
                      <TouchableOpacity className="border border-border px-3 py-2 rounded-md">
                        <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="border border-border px-3 py-2 rounded-md">
                        <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View className="items-center py-12">
                  <Ionicons
                    name="chatbubble-outline"
                    size={48}
                    color="#d1d5db"
                  />
                  <Text
                    className={`${textColor} text-lg font-medium mt-4 mb-2`}
                  >
                    No reviews yet
                  </Text>
                  <Text className={`text-center`}>
                    Be the first to share your experience with this restaurant!
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewsAndRatings;
