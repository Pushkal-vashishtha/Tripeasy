import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Discover Trending Places</Text>
      {trendingPlaces.map((place, index) => (
        <View key={index} style={styles.placeContainer}>
          {place.image ? (
            <Image source={{ uri: place.image }} style={styles.image} />
          ) : (
            <Image source={require('./../../assets/images/pl.jpg')} style={styles.image} />
          )}
          <View style={styles.placeDetails}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeCountry}>Country: <Text style={styles.bold}>{place.country}</Text></Text>
            <Text style={styles.placeBrief}><Text style={styles.italic}>{place.brief}</Text></Text>
            <Text style={styles.placeContinent}>Continent: <Text style={styles.bold}>{place.continent}</Text></Text>
          </View>
        </View>
      ))}
    </ScrollView>
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
  placeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeCountry: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  placeBrief: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  placeContinent: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});

export default Discover;