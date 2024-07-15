import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is used for stars

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons name="star" size={16} color="#FFD700" key={`star-full-${i}`} />
      );
    }

    // Half star
    if (halfStar) {
      stars.push(
        <Ionicons name="star-half" size={16} color="#FFD700" key="star-half" />
      );
    }

    // Empty stars (if any)
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons name="star-outline" size={16} color="#FFD700" key={`star-empty-${i}`} />
      );
    }

    return stars;
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {renderStars()}
      <Text style={{ marginLeft: 8 }}>{rating.toFixed(1)}</Text>
    </View>
  );
};

export default StarRating;
