import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import moment from 'moment/moment';
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';

const fetchImage = async (locationName) => {
  const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
  try {
    console.log("Fetching image for location:", locationName);
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: locationName,
        image_type: 'photo',
      },
    });
    console.log("Fetched image URL:", response.data.hits[0].largeImageURL);
    return response.data.hits[0].largeImageURL;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    throw error;
  }
};

export default function TripDetails() {
  const navigation = useNavigation();
  const { trip } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: ''
    });

    if (trip) {
      try {
        const parsedTrip = JSON.parse(trip);
        setTripDetails(parsedTrip);

        const tripData = JSON.parse(parsedTrip.tripData);
        const locationName = tripData?.locationInfo?.name;

        if (locationName) {
          fetchImage(locationName)
            .then(url => {
              setImageUrl(url);
              setLoading(false);
            })
            .catch(error => {
              console.error('Error fetching image:', error);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing trip details:", error);
        setLoading(false);
      }
    } else {
      console.warn("Trip details are not provided.");
      setLoading(false);
    }
  }, [trip]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={styles.centered}>
        <Text>No trip details available</Text>
      </View>
    );
  }

  const tripData = JSON.parse(tripDetails.tripData);

  return (
    <View style={styles.container}>
      <Image source={imageUrl ? { uri: imageUrl } : require('./../../assets/images/pl.jpg')} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.locationText}>
          {tripDetails.tripPlan?.trip_details?.destination}
        </Text>
        <Text style={styles.dates}>
          📅 {moment(tripData.startDate).format("MMM Do")} - {" "}
          {moment(tripData.endDate).format("MMM Do, YYYY")}
        </Text>
        <Text style={styles.travelers}>
          🚌 {tripData.traveler.title} - {tripData.traveler.desc}
        </Text>
      </View>

      <FlightInfo flightData={tripDetails?.tripPlan?.flights?.details} />
      <HotelList hotelList={tripDetails?.tripPlan?.hotels?.options} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  dates: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  travelers: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
});
