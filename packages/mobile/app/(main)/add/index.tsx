import { TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "../../../components/Header";
import { ArrowLeft, Flashlight, X } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button as RNButton, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import {
  CameraView,
  useCameraPermissions,
  FlashMode,
  BarcodeScanningResult,
} from "expo-camera";
import { Button } from "../../../components/Button";
import * as Haptics from "expo-haptics";

export default function AddScreen() {
  const { location } = useLocalSearchParams<{ location: string }>();

  if (!location) return null;

  const parsedLocation: {
    latitude: number;
    longitude: number;
  } = JSON.parse(location);

  const [scanning, setScanning] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>("off");

  const toggleFlash = () => {
    setFlash((prevFlash) => (prevFlash === "off" ? "on" : "off"));
  };

  const onBarcodeScanned = (result: BarcodeScanningResult) => {
    try {
      if (!scanning) return;
      const data = JSON.parse(result.data);
      setScanning(false);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      router.replace({
        pathname: "/add-info",
        params: {
          data: JSON.stringify({
            ...data,
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude,
          }),
        },
      });
    } catch (_) {}
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <RNButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <>
      <Header title="Add New Sensor" />

      <CameraView
        style={styles.camera}
        facing={"back"}
        flash={flash}
        enableTorch={flash === "on"}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      >
        <View
          style={{
            position: "absolute",
            top: 16,
            zIndex: 10,
            paddingHorizontal: 12,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Button variant="icon" onPress={() => router.back()}>
            <X size={24} color="#FF9500" />
          </Button>
          <Button variant="icon" onPress={toggleFlash}>
            <Flashlight size={24} color="black" />
          </Button>
        </View>

        {/* QR Code Scanner guiding square */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 50,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 10,
            }}
          />

          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            Scan QR Code
          </Text>
          <Text style={{ color: "white", fontSize: 16 }}>
            Activate the device and start logging
          </Text>
        </View>
      </CameraView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
