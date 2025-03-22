import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const CheckoutScreen = ({ navigation }: any) => {
  const [metodoPagamento, setMetodoPagamento] = useState("");

  const finalizarCompra = () => {
    if (!metodoPagamento) {
      alert("Selecione um método de pagamento.");
      return;
    }
    alert("Compra finalizada com sucesso!");
    navigation.navigate("Scanner");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <Button title="Cartão de Crédito" onPress={() => setMetodoPagamento("Crédito")} />
      <Button title="Cartão de Débito" onPress={() => setMetodoPagamento("Débito")} />
      <Button title="Pix" onPress={() => setMetodoPagamento("Pix")} />

      {metodoPagamento && <Text style={styles.selecionado}>Selecionado: {metodoPagamento}</Text>}

      <Button title="Finalizar Compra" onPress={finalizarCompra} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selecionado: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default CheckoutScreen;
