import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CreateTripContext } from '../../context/CreateTripContext';
import moment from 'moment';

export default function ReviewTrip() {
    const navigation = useNavigation();
    const { tripData, setTripData } = useContext(CreateTripContext);
    const router = useRouter();
    useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
        });
      }, []);
    

  return (
    <View style={{
        padding:25,
        paddingTop:75,
        backgroundColor:'#fff',
        height:'100%'
    }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:20
      }}>Review Your Trip
   </Text>
<View style={{
    marginTop:20
}}>
    <Text style={{
        fontFamily:'outfit-bold',
        fontSize:16
      }}>
        Before generating your trip , Please review your selection
    </Text>
    <View style={{
    marginTop:20,
    display:'flex',
    flexDirection:'row',
    gap:20
}}>
   <Text style={{
    fontSize:28
   }}>📍</Text>
    <View>
        <Text style={{
        fontFamily:'outfit',
        fontSize:16,
        color:'#808080'
      }}>Destiantion</Text>
        <Text style={{
        fontFamily:'outfit-medium',
        fontSize:16
      }}>{tripData.locationInfo?.name}</Text>
    </View>

</View>
<View style={{
    marginTop:35,
    display:'flex',
    flexDirection:'row',
    gap:20
}}>
   <Text style={{
    fontSize:28
   }}> 📅</Text>
    <View>
        <Text style={{
        fontFamily:'outfit',
        fontSize:16,
        color:'#808080'
      }}>Travel Date </Text>
        <Text style={{
        fontFamily:'outfit-medium',
        fontSize:16
      }}>{moment(tripData?.startDate).format('DD/MMM') +"  To  "+moment(tripData?.endDate).format('DD/MMM')+"  " }
      ({tripData?.totalNoOfDays}days)</Text>
    </View>
    
</View>
<View style={{
    marginTop:25,
    display:'flex',
    flexDirection:'row',
    gap:20
}}>
   <Text style={{
    fontSize:28
   }}> 👨‍👩‍👦</Text>
    <View>
        <Text style={{
        fontFamily:'outfit',
        fontSize:16,
        color:'#808080'
      }}>Who is Traveling </Text>
        <Text style={{
        fontFamily:'outfit-medium',
        fontSize:16
      }}>{tripData?.traveler?.title}</Text>
    </View>
    
</View>
<View style={{
    marginTop:25,
    display:'flex',
    flexDirection:'row',
    gap:20
}}>
   <Text style={{
    fontSize:28
   }}> 💰</Text>
    <View>
        <Text style={{
        fontFamily:'outfit',
        fontSize:16,
        color:'#808080'
      }}>Budget  </Text>
        <Text style={{
        fontFamily:'outfit-medium',
        fontSize:16
      }}>{tripData?.budget}</Text>
    </View>
    
</View>
</View>
<TouchableOpacity 
      onPress={()=>router.replace('/create-trip/generate-trip')}
      style={{
        padding:15,
        backgroundColor:'#000',
        borderRadius:15,
        marginTop:60
      }}>
        <Text style={{
          color:'#fff',
          textAlign:'center',
          fontFamily:'outfit-medium',
          fontSize:18  
        }}>
          Build My Trip 
        </Text>
      </TouchableOpacity>
    </View>
  )
}