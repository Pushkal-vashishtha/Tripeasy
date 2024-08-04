import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';

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

const getRandomCountry = (continent) => {
  const countries = {
    Africa: ['Egypt', 'Kenya', 'South Africa', 'Morocco', 'Nigeria'],
    Asia: ['Japan', 'India', 'Thailand', 'Vietnam', 'South Korea'],
    Europe: ['France', 'Italy', 'Spain', 'Germany', 'Greece'],
    NorthAmerica: ['Canada', 'Mexico', 'USA', 'Cuba', 'Jamaica'],
    SouthAmerica: ['Brazil', 'Argentina', 'Peru', 'Colombia', 'Chile'],
    Australia: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands'],
    Antarctica: ['Antarctica']
  };

  const continentCountries = countries[continent];
  return continentCountries[Math.floor(Math.random() * continentCountries.length)];
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
      place.country = getRandomCountry(continent);
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
        const placesWithImages = await Promise.all(
          places.map(async (place) => {
            const imageUrl = await fetchImage(place.country);
            return { ...place, image: imageUrl };
          })
        );
        setTrendingPlaces(placesWithImages);
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
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.error('Failed to open Wikipedia page:', err)
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Trending Places</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a place"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchNewPlace}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {searchedPlace && (
          <TouchableOpacity style={styles.addButton} onPress={addNewPlace}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {trendingPlaces.map((place, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCardPress(place.name)}
          >
            {place.image ? (
              <Image source={{ uri: place.image }} style={styles.cardImage} />
            ) : (
              <Image source={require('./../../assets/images/pl.jpg')} style={styles.cardImage} />
            )}
            <View style={styles.cardOverlay}>
              <Text style={styles.cardName}>{place.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#28a745',
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: '48%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Discover;
