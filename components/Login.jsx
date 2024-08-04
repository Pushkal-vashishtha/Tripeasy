import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  return (
    <View>
      <Image 
        source={require('./../assets/images/img1.jpg')}
        style={{
          width: '100%',
          height: 500
        }}
      />
      <View style={{
        backgroundColor: '#fff',
        marginTop: -20,
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,  // Corrected this to match the other radius
        padding: 15
      }}>
        <Text style={{
          fontSize: 28,
          fontFamily: 'outfit-bold'
        }}>
Trip Easy ..............        </Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: width * 0.04,
          textAlign: 'center',
          color: '#808080',
          marginTop: 15,
          lineHeight: 24,
        }}>
          Discover your next adventure effortlessly. Personalized itineraries at your fingertips. Travel smarter with AI-driven insights.
        </Text>
        <TouchableOpacity style={{
           backgroundColor: '#ff6347',
           paddingVertical: 15,
           borderRadius: 50,
           alignItems: 'center',
           justifyContent: 'center',
           marginTop: 20, // Adjust margin for spacing
           shadowColor: "#ff6347",
           shadowOffset: {
             width: 0,
             height: 4,
           },
           shadowOpacity: 0.3,
           shadowRadius: 4.65,
           elevation: 8,
         }
        } onPress={()=>router.push('auth/sign-in')}>
          <Text style={{
            color: '#fff',
            textAlign: 'center',
            fontFamily: 'outfit-bold',
            fontSize: width * 0.045,
          }}>
            Sign In with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
