import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ToastAndroid, AsyncStorage } from 'react-native'; // Import AsyncStorage
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword,getAuth } from 'firebase/auth';
import { auth } from './../../../configs/firebaseConfig'
export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  const onSignIn=()=>{
    if(!email && !password){
      ToastAndroid.show("Please enter Email and Password",ToastAndroid.LONG);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    router.replace('/mytrip');
    console.log(user);

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    if(errorCode=='auth/invalid-credential'){
      ToastAndroid.show("Invalid Credentials",ToastAndroid.LONG)
    }
  });

  }

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Let's Sign You In</Text>
          <Text style={styles.subHeaderText}>Welcome Back</Text>
          <Text style={styles.subHeaderText}>You've been missed</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter Email'
              placeholderTextColor="#a0a0a0"
              onChangeText={(val) =>setEmail(val)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder='Enter Password'
              placeholderTextColor="#a0a0a0"
              onChangeText={(val) =>setPassword(val)}
            />
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('auth/sign-up')}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 25,
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
  },
  headerContainer: {
    marginBottom: 40,
  },
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 10,
  },
  subHeaderText: {
    fontFamily: 'outfit',
    color: '#e0e0e0',
    fontSize: 18,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'outfit',
    color: 'white',
    marginBottom: 5,
  },
  input: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    fontFamily: 'outfit',
    color: 'white',
  },
  signInButton: {
    backgroundColor: '#ff6347',
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
  createAccountButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginTop: 15,
  },
  createAccountButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'outfit',
    fontSize: 16,
  },
});
