import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginAdm from "./screens/adm/LoginAdm";
import Estoque from "./screens/adm/Estoque";
import Dashboard from "./screens/adm/Dashboard";

import ScanProduto from "./screens/clientes/ScanProduto";
import Carrinho from "./screens/clientes/Carrinho";
import Checkout from "./screens/clientes/Checkout";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* ADM */}
        <Stack.Screen name="LoginAdm" component={LoginAdm} />
        <Stack.Screen name="Estoque" component={Estoque} />
        <Stack.Screen name="Dashboard" component={Dashboard} />

        {/* CLIENTES */}
        <Stack.Screen name="ScanProduto" component={ScanProduto} />
        <Stack.Screen name="Carrinho" component={Carrinho} />
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
