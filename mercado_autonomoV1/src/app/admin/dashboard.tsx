import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface Venda {
  id: string;
  produto: string;
  valor: number;
  data: string;
}

export default function DashboardScreen() {
  const [vendas, setVendas] = useState<Venda[]>([
    { id: "1", produto: "Refrigerante", valor: 5.99, data: "21/03/2025" },
    { id: "2", produto: "Chocolate", valor: 3.5, data: "21/03/2025" },
    { id: "3", produto: "Bolacha", valor: 2.75, data: "21/03/2025" },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const totalFaturado = vendas.reduce((total, venda) => total + venda.valor, 0);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function irParaEstoque() {
    setMenuOpen(false);
    router.push("/admin/estoque");
  }

  return (
    <View style={styles.container}>
      {/* Header com Ícone de Menu */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
          <Text style={{ fontSize: 20 }}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown do Menu */}
      {menuOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={irParaEstoque}>
            <Text style={styles.dropdownItem}>Ir para Estoque</Text>
          </TouchableOpacity>
        </View>
      )}

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
            <Text>
              {item.produto} - R$ {item.valor.toFixed(2)}
            </Text>
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
  header: {
    // Espaço para o título e o ícone do menu
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  menuIcon: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 5,
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
