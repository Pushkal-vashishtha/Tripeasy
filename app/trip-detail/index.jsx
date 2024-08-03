import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import moment from 'moment/moment';
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';
import PlanTrip from '../../components/TripDetails/PlanTrip';

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
  const params = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: ''
    });

    console.log("Received params:", JSON.stringify(params, null, 2));

    if (params.trip) {
      try {
        let parsedTrip;
        if (typeof params.trip === 'string') {
          parsedTrip = JSON.parse(params.trip);
        } else {
          parsedTrip = params.trip;
        }
        console.log("Parsed trip:", JSON.stringify(parsedTrip, null, 2));

        setTripDetails(parsedTrip);

        let tripData;
        if (typeof parsedTrip.tripData === 'string') {
          tripData = JSON.parse(parsedTrip.tripData);
        } else {
          tripData = parsedTrip.tripData;
        }
        console.log("Parsed tripData:", JSON.stringify(tripData, null, 2));

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
        setError("Failed to parse trip details");
        setLoading(false);
      }
    } else {
      setError("Trip details are not provided");
      setLoading(false);
    }
  }, [params.trip]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
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

  let tripData;
  try {
    tripData = typeof tripDetails.tripData === 'string' ? JSON.parse(tripDetails.tripData) : tripDetails.tripData;
  } catch (error) {
    console.error("Error parsing tripData:", error);
    return (
      <View style={styles.centered}>
        <Text>Error loading trip data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>✈️ Flights</Text>
        <FlightInfo flightData={tripDetails?.tripPlan?.flights?.details} />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>🏨 Hotels</Text>
        <HotelList hotelList={tripDetails?.tripPlan?.hotels?.options} />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>🌄 Plan Details</Text>
        <PlanTrip details={tripDetails?.tripPlan?.itinerary} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 20,
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 16,
    color: '#555',
  },
  travelers: {
    fontSize: 16,
    color: '#555',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});