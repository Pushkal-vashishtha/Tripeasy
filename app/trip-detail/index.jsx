import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react';
import { Image } from 'react-native';

export default function TripDetails() {
  const navigation = useNavigation();
  const {trip} = useLocalSearchParams();
  const [TripDetails,setTripDetails] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  
  useEffect(()=>{
    navigation.setOptions({
      headerShown:true,
      headerTransparent:true,
      headerTitle:''
    });
    setTripDetails(JSON.parse(trip));
  },[])
  return (
    <View>
       <Image source={imageUrl ? { uri: imageUrl } : require('./../../assets/images/pl.jpg')}  />
    </View>
  )
}