import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Routes />
      </SafeAreaView>
    </AuthProvider>
  );
}
