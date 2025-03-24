import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Platform, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const router = useRouter();

  // Se permissão ainda não foi carregada
  if (!permission) {
    return <View />;
  }

  // Se não concedido, pede permissão
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos da sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  // Se estivermos na web
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text>O scanner não é suportado na web.</Text>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      router.push(`/cliente/carrinho?produtoId=${data}`);
    }
  };

  const handleActivateScanner = () => {
    setCameraActive(true);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      {/* Topo da tela com instruções ou logo */}
      <View style={styles.infoContainer}>
        <Image
          source={require("../../../assets/images/your-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.instructionText}>
          Aproxime o código de barras na área de leitura.
        </Text>
        {!cameraActive && (
          <Button title="Iniciar Scanner" onPress={handleActivateScanner} />
        )}
      </View>

      {/* Parte de baixo da tela com a câmera */}
      {cameraActive && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={cameraType}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "code128"],
            }}
          />
          {scanned && (
            <Button
              title="Escanear novamente"
              onPress={() => setScanned(false)}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
});
