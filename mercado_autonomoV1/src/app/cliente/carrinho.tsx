import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Image } from "react-native";
import { useRouter, useSearchParams } from "expo-router";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

export default function CarrinhoScreen() {
  const router = useRouter();
  // Lê o parâmetro de query (produtoId) passado pela tela do scanner
  const { produtoId } = useSearchParams<{ produtoId?: string }>();

  // Aqui você pode usar o produtoId para, por exemplo, adicionar o produto ao carrinho.
  // Por enquanto, mantemos um carrinho mock:
  const [carrinho, setCarrinho] = useState<Produto[]>([
    { id: "1", nome: "Refrigerante", preco: 5.99, imagem: "https://via.placeholder.com/50", quantidade: 1 },
    { id: "2", nome: "Chocolate", preco: 3.50, imagem: "https://via.placeholder.com/50", quantidade: 1 },
  ]);

  const aumentarQuantidade = (id: string) => {
    setCarrinho(carrinho.map(produto =>
      produto.id === id ? { ...produto, quantidade: produto.quantidade + 1 } : produto
    ));
  };

  const diminuirQuantidade = (id: string) => {
    setCarrinho(carrinho.map(produto =>
      produto.id === id && produto.quantidade > 1
        ? { ...produto, quantidade: produto.quantidade - 1 }
        : produto
    ));
  };

  const totalCompra = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <Text>{item.nome} - R$ {item.preco.toFixed(2)}</Text>
            <View style={styles.quantidadeContainer}>
              <Button title="-" onPress={() => diminuirQuantidade(item.id)} />
              <Text>{item.quantidade}</Text>
              <Button title="+" onPress={() => aumentarQuantidade(item.id)} />
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: R$ {totalCompra.toFixed(2)}</Text>
      <Button title="Ir para Checkout" onPress={() => router.push("/cliente/checkout")} />
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  imagem: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});
