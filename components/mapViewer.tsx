import { LocationType } from '@/index';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

type MapViewerProps = {
  mapType: 'standard' | 'hybrid';
  location: LocationType | null; // null-safe
};

const INITIAL_REGION: Region = {
  latitude: 8.9475,
  longitude: 125.5406,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const MapViewer = forwardRef<MapView, MapViewerProps>(({ mapType, location }, ref) => {
  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      showsUserLocation
      showsPointsOfInterest
      rotateEnabled={false}
      mapType={mapType}
    >
      {location && (
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Selected Location"
          description={`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        />
      )}
    </MapView>
  );
});

MapViewer.displayName = 'MapViewer';

export default MapViewer;
