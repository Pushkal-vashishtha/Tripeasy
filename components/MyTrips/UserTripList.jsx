import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import moment from "moment";
import axios from "axios";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";

const fetchImage = async (locationName) => {
  const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: locationName,
        image_type: 'photo',
      },
    });
    return response.data.hits[0].largeImageURL;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    throw error; // Throw the error to handle it in the caller function
  }
};

export default function UserTripList({ userTrips }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Rendering UserTripList with userTrips:", userTrips);
    if (userTrips && userTrips.length > 0) {
      const firstTripLocation = JSON.parse(userTrips[0].tripData).locationInfo.name;
      fetchImage(firstTripLocation)
        .then(url => {
          setImageUrl(url);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          setLoading(false);
        });
    }
  }, [userTrips]);

  if (!userTrips || userTrips.length === 0) {
    return <Text>No trips available</Text>;
  }

  // Parse the tripData JSON string for the first trip
  const firstTrip = {
    ...userTrips[0],
    tripData: JSON.parse(userTrips[0].tripData),
  };

  // Parse the tripData JSON string for the rest of the trips
  const otherTrips = userTrips.slice(1).map((trip) => ({
    ...trip,
    tripData: JSON.parse(trip.tripData),
  }));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bigTripCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Image source={imageUrl ? { uri: imageUrl } : require('./../../assets/images/pl.jpg')} style={styles.image} />
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.location}>
              🌍 {firstTrip.tripData.locationInfo.name}
            </Text>
            <Text style={styles.dates}>
              📅 {moment(firstTrip.startDate).format("MMM Do")} -{" "}
              {moment(firstTrip.endDate).format("MMM Do, YYYY")}
            </Text>
            <Text style={styles.travelers}>
              🚌 {firstTrip.tripData.traveler.title} - {firstTrip.tripData.traveler.desc}
            </Text>
            <TouchableOpacity style={styles.button}
              onPress={() => router.push({ pathname: '/trip-detail', params: { trip: JSON.stringify(userTrips[0]) } })}>
              <Text style={styles.buttonText}>See Your Plans</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {otherTrips.map((trip, index) => (
          <UserTripCard trip={trip} key={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  bigTripCard: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  dates: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  travelers: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
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