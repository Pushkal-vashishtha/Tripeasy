import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment/moment';

const FlightInfo = ({ flightData }) => {
  if (!flightData || flightData.length === 0) {
    return (
      <View style={styles.noFlightsContainer}>
        <Text style={styles.noFlightsText}>No flight details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {flightData.map((flight, index) => (
        <View key={index} style={styles.flightCard}>
          <Text style={styles.flightText}>Flight Number: {flight.flight_number}</Text>
          <Text style={styles.flightText}>Airline: {flight.airline}</Text>
          <Text style={styles.flightText}>Departure: {flight.departure_city} at {flight.departure_time} on {moment(flight.departure_date).format("MMM Do, YYYY")}</Text>
          <Text style={styles.flightText}>Arrival: {flight.arrival_city} at {flight.arrival_time} on {moment(flight.arrival_date).format("MMM Do, YYYY")}</Text>
          <Text style={styles.flightText}>Price: {flight.price}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => handleBookFlight(flight.booking_url)}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const handleBookFlight = (bookingUrl) => {
  // Handle booking logic, e.g., open a web browser or navigate to the booking URL
  console.log("Booking flight:", bookingUrl);
  // Example: window.open(bookingUrl, '_blank'); // For web-based applications
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16, // Add horizontal padding to avoid content touching edges
  },
  flightCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  flightText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  noFlightsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noFlightsText: {
    fontSize: 16,
    color: '#555',
  },
});

export default FlightInfo;
