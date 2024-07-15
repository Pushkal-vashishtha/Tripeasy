import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
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
    <View style={styles.container}>
      {flightData.map((flight, index) => (
        <View key={index} style={styles.flightCard}>
          <Text style={styles.flightText}>Flight Number: {flight.flight_number}</Text>
          <Text style={styles.flightText}>Airline: {flight.airline}</Text>
          <Text style={styles.flightText}>Departure: {flight.departure_city} at {flight.departure_time} on {moment(flight.departure_date).format("MMM Do, YYYY")}</Text>
          <Text style={styles.flightText}>Arrival: {flight.arrival_city} at {flight.arrival_time} on {moment(flight.arrival_date).format("MMM Do, YYYY")}</Text>
          <Text style={styles.flightText}>Price: {flight.price}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  flightCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  flightText: {
    fontSize: 14,
    color: '#333',
  },
  noFlightsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFlightsText: {
    fontSize: 14,
    color: '#555',
  },
});

export default FlightInfo;
