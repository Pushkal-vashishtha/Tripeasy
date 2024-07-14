import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import {SelectTravelersList} from './../../constants/Options'
import OptionCard from '../../components/CreateTrip/OptionCard';
import { CreateTripContext } from '../../context/CreateTripContext';
export default function SelectTraveler() {
    const navigation = useNavigation();

    const [selectedTraveler, setSelectedTraveler] = useState()

    const {tripData,setTripData} = useContext(CreateTripContext);

    const router = useRouter();
    useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
        });
    }, []);

    useEffect(()=>{
      setTripData({...tripData,
        traveler:selectedTraveler
      })
    },[selectedTraveler])
    useEffect(()=>{
      console.log(tripData)
    },[tripData])
  return (
    <View style={{
        padding:25,
        paddingTop:75,
        backgroundColor:'#fff',
        height:'100%'
    }}>
      <Text style={{
        fontSize:27,
        fontFamily:'outfit-bold'
      }}>Who's Travelling</Text>
      <View style={{
        marginTop:20
      }}>
        <Text style={{
            fontFamily:'outfit-bold',
            fontSize:20
        }}>Choose your travellers </Text>
    <FlatList 
    data={SelectTravelersList}
    renderItem={({item,index})=>(
        <TouchableOpacity 
        onPress={()=>setSelectedTraveler(item)}
        style={{
            marginVertical:10
        }}>
        <OptionCard option={item} selectedOption={selectedTraveler} />   
        </TouchableOpacity>
    )}/>
      </View>
      <TouchableOpacity 
      onPress={()=>router.push('./select-dates')}
      style={{
        padding:15,
        backgroundColor:'#000',
        borderRadius:15,
        marginTop:20
      }}>
        <Text style={{
          color:'#fff',
          textAlign:'center',
          fontFamily:'outfit-medium',
          fontSize:18  
        }}>
          Continue
        </Text>
      </TouchableOpacity>

    </View>
  )
}