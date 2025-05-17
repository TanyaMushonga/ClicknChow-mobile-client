import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { MerchantsResponse } from '@/types';

const StoreInfor = () => {
    const { merchant } = useLocalSearchParams();
    const merchantInfor: MerchantsResponse = merchant
      ? JSON.parse(merchant as string)
      : null;
  return (
    <View>
      <Text>{merchantInfor.name}</Text>
    </View>
  )
}

export default StoreInfor