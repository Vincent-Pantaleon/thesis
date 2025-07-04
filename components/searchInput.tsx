import { ORS_API_KEY } from '@env';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import throttle from 'lodash.throttle';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

type Coords = { latitude: number; longitude: number };

type Props = {
  onLocationFound: (coords: Coords) => void;
};

export default function SearchInput({ onLocationFound }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { label: string; coords: Coords }[]
  >([]);

  // 🔁 Throttle search suggestions
  const throttledSearch = useMemo(
    () =>
      throttle(async (query: string) => {
        if (!query) return;

        try {
          const response = await axios.get(
            'https://api.openrouteservice.org/geocode/search',
            {
              params: {
                api_key: ORS_API_KEY,
                text: query,
                size: 5,
              },
            }
          );

          const results = response.data.features.map((f: any) => ({
            label: f.properties.label,
            coords: {
              latitude: f.geometry.coordinates[1],
              longitude: f.geometry.coordinates[0],
            },
          }));

          setSuggestions(results);
        } catch (err) {
          console.error('Autocomplete failed:', err);
        }
      }, 500),
    []
  );

  // 📩 Trigger on text change
  useEffect(() => {
    const trimmed = inputValue.trim();

    if (trimmed === '') {
      setSuggestions([]); // 🔁 clear dropdown
      return;
    }

    throttledSearch(trimmed);
  }, [inputValue]);

  const handleSelectSuggestion = (item: {
    label: string;
    coords: Coords;
  }) => {
    setInputValue(item.label);
    setSuggestions([]);
    onLocationFound(item.coords);
  };

  const handleSearch = async () => {
    const query = inputValue.trim();
    if (!query) return;

    try {
      setLoading(true);

      const response = await axios.get(
        'https://api.openrouteservice.org/geocode/autocomplete',
        {
          params: {
            api_key: ORS_API_KEY,
            text: query,
            size: 1,
          },
        }
      );

      const features = response.data.features;
      if (features.length === 0) {
        Alert.alert('Location not found', 'Please try a different place name.');
        return;
      }

      const [longitude, latitude] = features[0].geometry.coordinates;
      onLocationFound({ latitude, longitude });
    } catch (error) {
      console.error('Geocoding failed:', error);
      Alert.alert('Error', 'Something went wrong while searching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setSuggestions([]); // close dropdown
      }}
    >
      <View style={styles.wrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Enter location..."
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSearch}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleSearch}>
            {loading ? (
              <ActivityIndicator size="small" color="#666" style={styles.icon} />
            ) : (
              <MaterialIcons
                name="search"
                size={20}
                color="#666"
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) =>
                `${item.label}-${item.coords.latitude}-${item.coords.longitude}`
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectSuggestion(item)}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 30,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
  },
  icon: {
    marginLeft: 8,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  suggestionItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});
