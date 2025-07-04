import { MaterialIcons } from '@expo/vector-icons';
import Button from 'components/button';
import MapViewer from 'components/mapViewer';
import SearchInput from 'components/searchInput';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';

export type LocationType = {
  longitude: number;
  latitude: number;
};

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');
  const [color, setColor] = useState({ backgroundColor: '#2196F3', iconColor: '#fff' });
  const [view, setView] = useState<boolean>(false);
  const [transportMode, setTransportMode] = useState<'walk' | 'bike' | 'car'>('car');
  const [location, setLocation] = useState<LocationType | null>(null);

  const toggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  const toggleColor = () => {
    setColor((prev) => ({
      backgroundColor: prev.backgroundColor === '#2196F3' ? '#fff' : '#2196F3',
      iconColor: prev.iconColor === '#fff' ? '#666' : '#fff',
    }));
  };

  const toggleView = () => {
    setView((prev) => !prev);
  };

  const centerMapOnUser = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const region: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
    };
    mapRef.current?.animateToRegion(region, 500);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setLocation(null); // optional: clear dropdown if controlled from parent
      }}
    >
      <View style={styles.container}>
        {/* 🗘️ Map */}
        <MapViewer ref={mapRef} mapType={mapType} location={location} />

        {view === false ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputWrapper}
          >
            <SearchInput
              onLocationFound={(coords) => {
                const region = {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                mapRef.current?.animateToRegion(region, 500);
                setLocation(coords);
              }}
            />
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputWrapper}
          >
            <View style={styles.searchContainer}>
              <Text style={{ color: '#999' }}>Select Mode:</Text>

              <MaterialIcons
                name="directions-walk"
                size={24}
                color={transportMode === 'walk' ? '#2196F3' : '#666'}
                onPress={() => setTransportMode('walk')}
                style={styles.transportIcon}
              />
              <MaterialIcons
                name="directions-bike"
                size={24}
                color={transportMode === 'bike' ? '#2196F3' : '#666'}
                onPress={() => setTransportMode('bike')}
                style={styles.transportIcon}
              />
              <MaterialIcons
                name="directions-car"
                size={24}
                color={transportMode === 'car' ? '#2196F3' : '#666'}
                onPress={() => setTransportMode('car')}
                style={styles.transportIcon}
              />
            </View>

            <View style={[styles.searchContainer, { marginVertical: 10 }]}>
              <TextInput
                placeholder="Enter origin"
                style={styles.input}
                placeholderTextColor="#999"
              />
              <MaterialIcons name="trip-origin" size={20} color="#666" style={styles.icon} />
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Enter destination"
                style={styles.input}
                placeholderTextColor="#999"
              />
              <MaterialIcons name="place" size={20} color="#666" style={styles.icon} />
            </View>
          </KeyboardAvoidingView>
        )}

        {/* 📍 Floating Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              toggleView();
            }}
            backgroundColor={color.backgroundColor}
            iconColor={color.iconColor}
            iconName={view ? 'close' : 'directions'}
          />

          <Button
            onPress={() => {
              toggleMapType();
              toggleColor();
            }}
            backgroundColor={color.backgroundColor}
            iconColor={color.iconColor}
            iconName="layers"
          />
          <Button
            onPress={centerMapOnUser}
            backgroundColor={color.backgroundColor}
            iconColor={color.iconColor}
            iconName="my-location"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
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
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    gap: 12,
  },
  transportBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  transportIcon: {
    marginHorizontal: 12,
  },
});
