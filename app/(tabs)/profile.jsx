import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from './../../configs/firebaseConfig'; // Adjust path based on your project structure

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      await auth.signOut();
      console.log('Sign-out successful');
      router.replace('/auth/sign-up'); // Use replace to navigate to sign-up screen
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing app developed by Pushkal Vashishtha! [App Link]',
      });
    } catch (error) {
      console.error('Error sharing the app:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <View style={styles.userIntroContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.userImage} />
          ) : (
            <Image source={require('./../../assets/images/pl.jpg')} style={styles.userImage} />
          )}
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share App</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Developed by Pushkal Vashishtha</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  userIntroContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 2,
  },
  userName: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginBottom: 5,
    color: '#333',
  },
  userEmail: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#666',
  },
  signOutButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  footer: {
    fontFamily: 'outfit-medium',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default Profile;
