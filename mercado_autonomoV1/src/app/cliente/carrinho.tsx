import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CameraView, CameraType } from "expo-camera";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

export default function CarrinhoScreen() {
  // Recupera o parâmetro produtoId se estiver presente
  const { produtoId } = useLocalSearchParams<{ produtoId?: string }>();

  // Estado do carrinho (produtos)
  const [carrinho, setCarrinho] = useState<Produto[]>([
    {
      id: "1",
      nome: "Refrigerante",
      preco: 5.99,
      imagem: "https://via.placeholder.com/50",
      quantidade: 1,
    },
    {
      id: "2",
      nome: "Chocolate",
      preco: 3.5,
      imagem: "https://via.placeholder.com/50",
      quantidade: 1,
    },
  ]);

  // Lista de produtos disponíveis para "adicionar manualmente"
  const [produtosDisponiveis] = useState<Produto[]>([
    {
      id: "3",
      nome: "Peppers",
      preco: 4.5,
      imagem: "https://via.placeholder.com/50/FF0000/FFFFFF?text=Peppers",
      quantidade: 1,
    },
    {
      id: "4",
      nome: "Eggplant",
      preco: 6.0,
      imagem: "https://via.placeholder.com/50/800080/FFFFFF?text=Eggplant",
      quantidade: 1,
    },
    {
      id: "5",
      nome: "Onion",
      preco: 2.0,
      imagem: "https://via.placeholder.com/50/AAAAAA/FFFFFF?text=Onion",
      quantidade: 1,
    },
    {
      id: "6",
      nome: "Tomato",
      preco: 3.0,
      imagem: "https://via.placeholder.com/50/FF6347/FFFFFF?text=Tomato",
      quantidade: 1,
    },
  ]);

  // Estados para modais de scanner e menu manual
  const [scannerModalVisible, setScannerModalVisible] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);

  // Estados para o scanner integrado
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("back");

  // Função para adicionar um produto ao carrinho
  const adicionarProdutoAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const index = prev.findIndex((p) => p.id === produto.id);
      if (index !== -1) {
        // Se o produto já existir, incrementa a quantidade
        const novoCarrinho = [...prev];
        novoCarrinho[index].quantidade += produto.quantidade;
        return novoCarrinho;
      }
      // Se não existir, adiciona
      return [...prev, produto];
    });
  };

  // Remover produto do carrinho
  const removerProduto = (id: string) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  // Ajustar quantidade
  const aumentarQuantidade = (id: string) => {
    setCarrinho((prev) =>
      prev.map((produto) =>
        produto.id === id
          ? { ...produto, quantidade: produto.quantidade + 1 }
          : produto
      )
    );
  };

  const diminuirQuantidade = (id: string) => {
    setCarrinho((prev) =>
      prev.map((produto) =>
        produto.id === id && produto.quantidade > 1
          ? { ...produto, quantidade: produto.quantidade - 1 }
          : produto
      )
    );
  };

  const totalCompra = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  // Scanner integrado
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      const novoProduto: Produto = {
        id: data,
        nome: `Produto ${data}`,
        preco: 9.99,
        imagem: "https://via.placeholder.com/50",
        quantidade: 1,
      };
      adicionarProdutoAoCarrinho(novoProduto);
      setTimeout(() => {
        setScanned(false);
        setScannerModalVisible(false);
      }, 1500);
    }
  };

  // Renderiza cada produto do carrinho
  const renderCarrinhoItem = ({ item }: { item: Produto }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.imagem }} style={styles.imagem} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text>R$ {item.preco.toFixed(2)}</Text>
      </View>
      <View style={styles.quantidadeContainer}>
        <Button title="-" onPress={() => diminuirQuantidade(item.id)} />
        <Text>{item.quantidade}</Text>
        <Button title="+" onPress={() => aumentarQuantidade(item.id)} />
      </View>
      <Button
        title="Remover"
        color="red"
        onPress={() => removerProduto(item.id)}
      />
    </View>
  );

  // Renderiza cada produto disponível para seleção manual
  const renderDisponivelItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity
      style={styles.disponivelItem}
      onPress={() => {
        adicionarProdutoAoCarrinho(item);
        setManualModalVisible(false);
      }}
    >
      <Image source={{ uri: item.imagem }} style={styles.disponivelImagem} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.disponivelNome}>{item.nome}</Text>
        <Text>R$ {item.preco.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>
      {produtoId && (
        <Text style={styles.info}>Produto escaneado: {produtoId}</Text>
      )}
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id}
        renderItem={renderCarrinhoItem}
      />
      <Text style={styles.total}>Total: R$ {totalCompra.toFixed(2)}</Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="Escanear mais produtos"
          onPress={() => setScannerModalVisible(true)}
        />
        <Button
          title="Adicionar manualmente"
          onPress={() => setManualModalVisible(true)}
        />
      </View>

      {/* Modal do scanner */}
      <Modal
        visible={scannerModalVisible}
        animationType="slide"
        onRequestClose={() => setScannerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Scanner Integrado</Text>
          <View style={styles.modalScannerContainer}>
            <CameraView
              style={styles.modalCamera}
              facing={cameraType}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "ean13", "code128"],
              }}
            />
          </View>
          <Button
            title="Fechar Scanner"
            onPress={() => setScannerModalVisible(false)}
          />
        </View>
      </Modal>

      {/* Modal para seleção manual */}
      <Modal
        visible={manualModalVisible}
        animationType="slide"
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecione um produto</Text>
          <FlatList
            data={produtosDisponiveis}
            keyExtractor={(item) => item.id}
            renderItem={renderDisponivelItem}
          />
          <Button
            title="Cancelar"
            onPress={() => setManualModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout principal
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  info: {
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  // Itens do carrinho
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  imagem: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontWeight: "bold",
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  // Modal geral
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  // Scanner
  modalScannerContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  modalCamera: {
    flex: 1,
  },

  // Lista de produtos disponíveis
  disponivelItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  disponivelImagem: {
    width: 50,
    height: 50,
  },
  disponivelNome: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
