import { View, Text, ScrollView } from "react-native";
import React from "react";
import Banner from "@/components/banner";

const Home = () => {
  return (
    <ScrollView className="p-3 flex-1 bg-background dark:bg-background-dark mt-4">
      <Banner />
    </ScrollView>
  );
};

export default Home;
