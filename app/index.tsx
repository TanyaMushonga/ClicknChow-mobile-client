import { router } from "expo-router";
import { useEffect, useState } from "react";

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      router.push("/(auth)/welcome");
    }
  }, [isMounted]);

  return null;
};

export default Index;