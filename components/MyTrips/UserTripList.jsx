import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';

export default function UserTripList({ userTrips }) {
  useEffect(() => {
    console.log('Rendering UserTripList with userTrips:', userTrips);
  }, [userTrips]);

  const parsedTrips = userTrips.map(trip => ({
    ...trip,
    tripData: JSON.parse(trip.tripData),
  }));

  return (
    <View style={styles.container}>
      {parsedTrips.map((trip, index) => (
        <View key={index} style={styles.tripCard}>
          <Image
            source={require('./../../assets/images/pl.jpg')}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.location}>🌍 {trip.tripData.locationInfo.name}</Text>
            <Text style={styles.dates}>
              📅 {moment(trip.tripData.startDate).format('MMM Do')} - {moment(trip.tripData.endDate).format('MMM Do, YYYY')}
            </Text>
            <Text style={styles.travelers}>
              🚌 {trip.tripData.traveler.title} - {trip.tripData.traveler.desc}
            </Text>
          </View>

        </View>
      ))}
<TouchableOpacity 
  style={styles.button}
  onPress={() => {
    // Handle button press, e.g., navigate to trip details
    console.log('See plans for trip:', trip.docId);
  }}
>
  <Text style={styles.buttonText}>See Your Plans</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  travelers: {
    fontSize: 14,
    color: '#666',
  },
});