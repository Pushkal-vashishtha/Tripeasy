import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const fetchImage = async (locationName) => {
  const apiKey = '44938756-d9d562ffdaf712150c470c59e';
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: locationName,
        image_type: 'photo',
      },
    });
    return response.data.hits[0]?.largeImageURL;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    return null;
  }
};

const fetchPOIFromMapTiler = async (bbox, countryName) => {
  const apiKey = 'uCBXEjePDis0WAcvUmjc';
  try {
    const response = await axios.get('https://api.maptiler.com/geocoding/poi.json', {
      params: {
        key: apiKey,
        bbox: bbox,
        limit: 1,
      },
    });
    const feature = response.data.features[0];
    if (feature) {
      return {
        name: feature.properties.name,
        brief: feature.properties.description || 'A popular place to visit.',
        location: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`,
        country: countryName,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching POI from MapTiler:", error);
    return null;
  }
};

const fetchPOIsFromContinents = async () => {
  const bboxes = {
    Africa: ['-18.679253,34.559989,51.414942,37.340738', 'Africa'],
    Asia: ['24.396308,54.229087,153.986672,81.137995', 'Asia'],
    Europe: ['-31.464799,34.815924,39.477907,71.185476', 'Europe'],
    NorthAmerica: ['-168.000123,5.499550,-52.233040,83.162102', 'North America'],
    SouthAmerica: ['-93.167592,-56.526054,-28.650543,12.524147', 'South America'],
    Australia: ['112.921114,-54.750690,159.278992,-10.062805', 'Australia'],
    Antarctica: ['-180.000000,-90.000000,180.000000,-60.000000', 'Antarctica']
  };

  const placesPromises = Object.keys(bboxes).map(async (continent) => {
    const place = await fetchPOIFromMapTiler(bboxes[continent][0], bboxes[continent][1]);
    if (place) {
      place.continent = continent;
      const imageUrl = await fetchImage(place.name);
      place.image = imageUrl;
    }
    return place;
  });

  return Promise.all(placesPromises).then(places => places.filter(place => place !== null));
};

const Discover = () => {
  const [trendingPlaces, setTrendingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPlace, setSearchedPlace] = useState(null);

  useEffect(() => {
    const loadTrendingPlaces = async () => {
      try {
        const places = await fetchPOIsFromContinents();
        setTrendingPlaces(places);
        setLoading(false);
      } catch (error) {
        console.error("Error loading trending places:", error);
        setLoading(false);
      }
    };

    loadTrendingPlaces();
  }, []);

  const searchNewPlace = async () => {
    try {
      const imageUrl = await fetchImage(searchQuery);
      if (imageUrl) {
        setSearchedPlace({
          name: searchQuery,
          image: imageUrl,
          country: searchQuery,
          brief: 'A place you searched for.',
          continent: 'Unknown',
        });
      } else {
        setSearchedPlace(null);
      }
    } catch (error) {
      console.error("Error searching new place:", error);
    }
  };

  const addNewPlace = () => {
    if (searchedPlace) {
      setTrendingPlaces((prevPlaces) => {
        const updatedPlaces = [searchedPlace, ...prevPlaces];
        return updatedPlaces.slice(0, 20); // Limit to 20 places
      });
      setSearchedPlace(null);
      setSearchQuery('');
    }
  };

  const handleCardPress = (name) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${name}`;
    WebBrowser.openBrowserAsync(wikipediaUrl);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Discover a new place"
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchNewPlace}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {searchedPlace && (
        <TouchableOpacity style={styles.addButton} onPress={addNewPlace}>
          <Text style={styles.addButtonText}>Add to Trending</Text>
        </TouchableOpacity>
      )}
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {trendingPlaces.map((place, index) => (
          <TouchableOpacity
            key={`${place.name}-${index}`} // Ensure each key is unique
            style={styles.card}
            onPress={() => handleCardPress(place.name)}
          >
            {place.image ? (
              <Image source={{ uri: `${place.image}?${new Date().getTime()}` }} style={styles.cardImage} />
            ) : (
              <Image source={require('./../../assets/images/pl.jpg')} style={styles.cardImage} />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardName}>{place.name}</Text>
              <Text style={styles.cardBrief}>{place.brief}</Text>
              <View style={styles.cardFooter}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.cardLocation}>{place.country}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#6C63FF',
    borderRadius: 25,
  },
  addButton: {
    alignSelf: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: '48%',
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBrief: {
    color: '#fff',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cardLocation: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default Discover;
