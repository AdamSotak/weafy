import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SearchBar } from "../../components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings, Plus, MapPin } from "lucide-react-native";
import { Button } from "../../components/Button";
import { useCallback, useRef, useEffect, useState } from "react";
import * as Location from "expo-location";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MainBottomSheet } from "../../components/MainBottomSheet";
import { router, useFocusEffect } from "expo-router";
import { Device } from "@prisma/client";
import api from "../../api/api";
import { SharedValue } from "react-native-reanimated/lib/typescript/Animated";

// Create a new AnimatedMarker component at the top of the file
const AnimatedMarker = ({
  device,
  isSelected,
}: {
  device: Device;
  isSelected: boolean;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isSelected ? 1.5 : 1, { duration: 200 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Marker
      key={device.id}
      identifier={device.id}
      coordinate={{
        latitude: device.latitude,
        longitude: device.longitude,
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: device.type === "PLANT" ? "lightgreen" : "#FF69B4",
            padding: 5,
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          animatedStyle,
        ]}
      />
    </Marker>
  );
};

export default function App() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const markerScales = useRef<{ [key: string]: SharedValue<number> }>({});

  const fetchDevices = useCallback(async () => {
    const response = await api.get("/api/devices");
    setDevices(response.data as Device[]);
  }, []);

  const centerMapToUserLocation = useCallback(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  }, [region]);

  const getUserLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion((prev) => ({
      ...prev,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
  }, []);

  useEffect(() => {
    getUserLocation();
    fetchDevices();
  }, [getUserLocation, fetchDevices]);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices])
  );

  return (
    <>
      <StatusBar style="auto" />

      <View
        style={{
          marginTop: insets.top,
          paddingHorizontal: 12,
          zIndex: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        <View style={{ flex: 1 }}>
          <SearchBar onPress={() => router.push("chat")} />
        </View>
        <Button variant={"icon"} onPress={() => router.push("settings")}>
          <Settings size={24} color={"black"} />
        </Button>
      </View>

      <MapView
        style={styles.map}
        ref={mapRef}
        region={region}
        showsUserLocation={true}
        showsCompass={false}
        onMarkerPress={(event) => {
          const markerId = event.nativeEvent.id;
          const newSelectedId = markerId === selectedMarkerId ? null : markerId;
          setSelectedMarkerId(newSelectedId);
        }}
        onPress={() => {
          // Deselect and animate back when clicking map
          if (selectedMarkerId && markerScales.current[selectedMarkerId]) {
            markerScales.current[selectedMarkerId].value = withTiming(1, {
              duration: 200,
            });
            setSelectedMarkerId(null);
          }
        }}
      >
        {devices.map((device) => (
          <AnimatedMarker
            key={device.id}
            device={device}
            isSelected={device.id === selectedMarkerId}
          />
        ))}
      </MapView>

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
          }}
        >
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairHorizontal} />
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          justifyContent: "space-between",
          left: 16,
          right: 16,
          bottom: "22%",
          zIndex: 0,
          gap: 8,
        }}
      >
        <Button variant="icon" onPress={centerMapToUserLocation}>
          <MapPin size={24} color="#34C759" />
        </Button>

        <Button
          variant="icon"
          onPress={async () => {
            const camera = await mapRef.current?.getCamera();
            router.push({
              pathname: "add",
              params: {
                location: JSON.stringify(camera?.center),
              },
            });
          }}
        >
          <Plus size={24} color="#007AFF" />
        </Button>
      </View>

      <MainBottomSheet
        markerId={selectedMarkerId?.toString() || ""}
        onDevicePress={(device) => {
          setSelectedMarkerId(device.id);
        }}
        onClose={() => {
          // Animate marker back to original size when closing bottom sheet
          if (selectedMarkerId && markerScales.current[selectedMarkerId]) {
            markerScales.current[selectedMarkerId].value = withTiming(1, {
              duration: 200,
            });
          }
          setSelectedMarkerId(null);
        }}
        onDeviceDelete={(device) => {
          setDevices(devices.filter((device) => device.id !== device.id));
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  crosshairVertical: {
    position: "absolute",
    width: 2,
    height: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    left: "50%",
    marginLeft: -1,
  },
  crosshairHorizontal: {
    position: "absolute",
    width: 20,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    top: "50%",
    marginTop: -1,
  },
});
