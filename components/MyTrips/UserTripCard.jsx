import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import moment from 'moment';
import axios from 'axios';

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
    return response.data.hits[0].largeImageURL;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    throw error;
  }
};

const UserTripCard = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  if (!trip || !trip.tripData) {
    return null; // Render nothing if trip data is invalid
  }

  let tripData;

  try {
    tripData = typeof trip.tripData === 'string' ? JSON.parse(trip.tripData) : trip.tripData;
  } catch (error) {
    console.error('Failed to parse trip data:', error);
    return null; // Render nothing if JSON parsing fails
  }

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const url = await fetchImageUrl(tripData.locationInfo.name);
        setPhotoUrl(url);
      } catch (error) {
        console.error('Error fetching image from Pixabay:', error);
      }
    };
    fetchPhoto();
  }, [tripData.locationInfo.name]);

  return (
    <View style={styles.cardContainer}>
      <Image
        source={photoUrl ? { uri: photoUrl } : require('./../../assets/images/pl.jpg')}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardLocation}>
          🌍 {tripData.locationInfo.name}
        </Text>
        <Text style={styles.dates}>
          📅 {moment(tripData.startDate).format("MMM Do")} - {" "}
          {moment(tripData.endDate).format("MMM Do, YYYY")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
  },
  cardInfo: {
    marginLeft: 10,
    flex: 1,
  },
  cardLocation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dates: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});

export default UserTripCard;