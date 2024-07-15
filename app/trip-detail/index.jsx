import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import moment from 'moment/moment';
import FlightInfo from '../../components/TripDetails/FlightInfo';

const fetchImage = async (locationName) => {
  const clientId = "indVtoi5_jJjYNbcgO3S6ee0Ihy8ftmIlckpHegzlVs"; // Replace with your Unsplash Access Key
  try {
    console.log("Fetching image for location:", locationName);
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query: locationName,
        client_id: clientId,
      },
    });
    console.log("Fetched image URL:", response.data.urls.regular);
    return response.data.urls.regular;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
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
    console.log(tripDetails?.tripPlan?.flights?.details);

    if (trip) {
      try {
        console.log("Raw trip data:", trip);
        const parsedTrip = JSON.parse(trip);
        console.log("Parsed trip data:", parsedTrip);
        setTripDetails(parsedTrip);

        const tripData = JSON.parse(parsedTrip.tripData);
        console.log("Parsed tripData:", tripData);

        const locationName = tripData?.locationInfo?.name;
        console.log("Location name:", locationName);

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
      {/* Add other trip details here */}
      <View style={{
        padding:10,
        marginTop:-30,
        backgroundColor:'#fff',
        borderTopLeftRadius:15,
        borderTopRightRadius:15
      }}>
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
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 16,
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
