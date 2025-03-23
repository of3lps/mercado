import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

interface Venda {
  id: string;
  produto: string;
  valor: number;
  data: string;
}

export default function DashboardScreen() {
  const [vendas, setVendas] = useState<Venda[]>([
    { id: "1", produto: "Refrigerante", valor: 5.99, data: "21/03/2025" },
    { id: "2", produto: "Chocolate", valor: 3.50, data: "21/03/2025" },
    { id: "3", produto: "Bolacha", valor: 2.75, data: "21/03/2025" },
  ]);

  const totalFaturado = vendas.reduce((total, venda) => total + venda.valor, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Total Faturado:</Text>
        <Text style={styles.value}>R$ {totalFaturado.toFixed(2)}</Text>
      </View>

      <Text style={styles.subtitle}>Últimas Vendas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.vendaItem}>
            <Text>{item.produto} - R$ {item.valor.toFixed(2)}</Text>
            <Text style={styles.data}>{item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  box: {
    padding: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vendaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  data: {
    color: "#777",
  },
});
