import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'expo-router';


// Function to fetch image URL from Pixabay
const fetchImageUrl = async (query) => {
  const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
      },
    });
    return response.data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    return null;
  }
};

const UserTripCard = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const router = useRouter();

  if (!trip) {
    console.error('Trip data is missing');
    return null;
  }

  let tripData;

  // Safely parse tripData
  try {
    tripData = typeof trip.tripData === 'string' ? JSON.parse(trip.tripData) : trip.tripData;
  } catch (error) {
    console.error('Failed to parse trip data:', error);
    return null;
  }

  useEffect(() => {
    const fetchPhoto = async () => {
      if (tripData?.locationInfo?.name) {
        const url = await fetchImageUrl(tripData.locationInfo.name.trim());
        setPhotoUrl(url);
      }
    };
    fetchPhoto();
  }, [tripData?.locationInfo?.name]);

  const handlePress = () => {
    console.log("Trip data before navigation:", JSON.stringify(trip, null, 2));
    router.push({
      pathname: '/trip-detail',
      params: { trip: JSON.stringify(trip) }
    });
  };
  
  if (!tripData || !tripData.locationInfo) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Image
        source={photoUrl ? { uri: photoUrl } : require('./../../assets/images/pl.jpg')}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardLocation}>
          🌍 {tripData.locationInfo.name.trim()}
        </Text>
        <Text style={styles.cardDate}>
          📅 {moment(trip.startDate).format('MMM Do YYYY')} - {moment(trip.endDate).format('MMM Do YYYY')}
        </Text>
        <Text style={styles.cardBudget}>
          💸 Budget: {tripData.budget}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>See Your Plans</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardInfo: {
    padding: 16,
  },
  cardLocation: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  cardBudget: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default UserTripCard;