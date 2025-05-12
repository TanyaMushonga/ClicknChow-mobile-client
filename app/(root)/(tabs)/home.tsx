import { View, Text, ScrollView } from "react-native";
import React from "react";
import Banner from "@/components/banner";
import Filters from "@/components/filters";
import LastOrder from "@/components/last-order";
import TrendingNearYou from "@/components/treding-near-you";
import Search from "@/components/search";
import TopMerchants from "@/components/top-merchants";
import DealsAndCombos from "@/components/deals&combos";

const Home = () => {
  return (
    <ScrollView>
      <View className="px-3 flex-1 bg-background dark:bg-background-dark pb-5">
        <Search />
        <Banner />
        <Filters />
        <LastOrder />
        <TrendingNearYou />
        <TopMerchants />
        <DealsAndCombos />
      </View>
    </ScrollView>
  );
};

export default Home;
