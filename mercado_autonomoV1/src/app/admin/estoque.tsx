import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";

interface Produto {
  id: string;
  nome: string;
  preco: string;
}

export default function EstoqueScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");

  const adicionarProduto = () => {
    if (!nome || !preco) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const novoProduto: Produto = {
      id: Math.random().toString(),
      nome,
      preco,
    };

    setProdutos([...produtos, novoProduto]);
    setNome("");
    setPreco("");
  };

  const removerProduto = (id: string) => {
    setProdutos(produtos.filter((produto) => produto.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />
      <Button title="Adicionar Produto" onPress={adicionarProduto} />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.produto}>
            <Text>{item.nome} - R$ {item.preco}</Text>
            <Button title="Remover" color="red" onPress={() => removerProduto(item.id)} />
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  produto: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
});
