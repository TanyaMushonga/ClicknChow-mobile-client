import { View, Text, ScrollView } from "react-native";
import React from "react";
import Search from "@/components/search";

const Home = () => {
  return (
    <ScrollView className="p-3 flex-1">
      <Search />
    </ScrollView>
  );
};

export default Home;
