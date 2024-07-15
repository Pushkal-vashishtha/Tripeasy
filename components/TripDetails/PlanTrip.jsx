import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const fetchActivityImage = async (activity) => {
  const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
  try {
    // Find the index of "visit the " in the activity string
    const visitIndex = activity.toLowerCase().indexOf("visit the ");
    let searchQuery;

    if (visitIndex !== -1) {
      // If "visit the " is found, take the text after it
      const afterVisit = activity.slice(visitIndex + 10);
      // Find the index of "(" if it exists
      const parenthesisIndex = afterVisit.indexOf("(");
      if (parenthesisIndex !== -1) {
        // If "(" is found, take the text before it
        searchQuery = afterVisit.slice(0, parenthesisIndex).trim();
      } else {
        // If no "(", take up to 20 characters
        searchQuery = afterVisit.slice(0, 20).trim();
      }
    } else {
      // If "visit the " is not found, take the first 20 characters of the activity
      const parenthesisIndex = activity.indexOf("(");
      if (parenthesisIndex !== -1 && parenthesisIndex < 20) {
        searchQuery = activity.slice(0, parenthesisIndex).trim();
      } else {
        searchQuery = activity.slice(0, 20).trim();
      }
    }

    // Ensure the search query is not empty
    if (!searchQuery) {
      searchQuery = "travel"; // fallback search term
    }

    console.log("Search query:", searchQuery); // Log the search query for debugging

    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        per_page: 3,
      },
    });
    if (response.data.hits.length > 0) {
      return response.data.hits[0].largeImageURL;
    } else {
      console.log("No images found for activity:", searchQuery);
      return null;
    }
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error.response ? error.response.data : error.message);
    return 'https://imgs.search.brave.com/9Jw4U9sNR-VAYxYlGWRuH-ArazbAyCpSgQ5ndG8sZ64/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93cml0/aW5nZXhlcmNpc2Vz/LmNvLnVrL2ltYWdl/cy9tb2JpbGUvd2F0/ZXJmYWxsLWJveS5q/cGc'; // Replace with an actual default image URL
  }
};
const PlanTrip = ({ details }) => {
  if (!details) {
    return null;
  }

  const sortedDays = Object.keys(details).sort((a, b) => {
    const dayA = parseInt(a.replace('day', ''));
    const dayB = parseInt(b.replace('day', ''));
    return dayA - dayB;
  });

  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const newImages = {};
      for (const dayKey of sortedDays) {
        const dayDetails = details[dayKey];
        const activity = Array.isArray(dayDetails.activity) ? dayDetails.activity[0] : dayDetails.activity;
        const imageUrl = await fetchActivityImage(activity);
        newImages[dayKey] = imageUrl;
      }
      setImages(newImages);
      setLoading(false);
    };
    fetchImages();
  }, [details]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sortedDays.map((dayKey) => {
        const dayDetails = details[dayKey];
        const activities = Array.isArray(dayDetails.activity) ? dayDetails.activity : [dayDetails.activity];
        const times = Array.isArray(dayDetails.time) ? dayDetails.time : [dayDetails.time];

        return (
          <View key={dayKey} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{dayKey.toUpperCase()}</Text>
            {images[dayKey] ? (
              <Image source={{ uri: images[dayKey] }} style={styles.activityImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Image not available</Text>
              </View>
            )}
            {activities.map((activity, index) => (
              <View key={index} style={styles.activityContainer}>
                <Text style={styles.timeText}>{times[index]}</Text>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dayContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  activityContainer: {
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
  },
  activityImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#555',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlanTrip;