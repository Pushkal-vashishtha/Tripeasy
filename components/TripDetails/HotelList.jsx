import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const HotelList = ({ hotelList }) => {
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    // Fetch images for each hotel in hotelList
    const fetchHotelImages = async () => {
      const images = {};
      for (const hotel of hotelList) {
        const imageUrl = await fetchImageFromPixabay(hotel.hotel_name);
        images[hotel.hotel_name] = imageUrl;
      }
      setHotelImages(images);
    };

    fetchHotelImages();
  }, [hotelList]);

  const fetchImageFromPixabay = async (searchTerm) => {
    const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchTerm)}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        return data.hits[0].webformatURL; // Adjust as per Pixabay API response structure
      } else {
        throw new Error('No images found');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  if (!hotelList || hotelList.length === 0) {
    return (
      <View style={styles.noHotelsContainer}>
        <Text style={styles.noHotelsText}>No hotel details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {hotelList.map((hotel, index) => (
        <View key={index} style={styles.hotelCard}>
          <Image source={{ uri: hotelImages[hotel.hotel_name] || 'https://via.placeholder.com/400x300.png?text=Image+Not+Found' }} style={styles.hotelImage} />
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>{hotel.hotel_name}</Text>
            <Text style={styles.hotelAddress}>{hotel.hotel_address}</Text>
            <Text style={styles.hotelDescription}>{hotel.description}</Text>
            <Text style={styles.hotelPrice}>Price: {hotel.price}</Text>
            <TouchableOpacity style={styles.bookButton} onPress={() => handleBookHotel(hotel.booking_url)}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const handleBookHotel = (bookingUrl) => {
  // Handle booking logic, e.g., open a web browser or navigate to the booking URL
  console.log("Booking hotel:", bookingUrl);
  // Example: window.open(bookingUrl, '_blank'); // For web-based applications
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16, // Add horizontal padding to avoid content touching edges
  },
  hotelCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  hotelImage: {
    width: windowWidth * 0.35, // Adjust the width according to your design needs
    height: windowWidth * 0.35, // Maintain aspect ratio
    resizeMode: 'cover',
  },
  hotelDetails: {
    flex: 1,
    padding: 16,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hotelAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  hotelDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  hotelPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  noHotelsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noHotelsText: {
    fontSize: 16,
    color: '#555',
  },
});

export default HotelList;
