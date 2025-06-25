import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function App() {
    return (
        <View style={{ flex: 1 }}>
            <MapView style={StyleSheet.absoluteFill} provider={PROVIDER_GOOGLE}/>
        </View>
    )
}