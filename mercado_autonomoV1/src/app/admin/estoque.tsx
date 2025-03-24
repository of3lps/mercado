import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { CameraView, CameraType } from "expo-camera";
// Para escolher foto da galeria, poderíamos usar expo-image-picker (não incluído neste exemplo).

interface Produto {
  id: string;         // Código de barras ou ID único
  nome: string;
  preco: number;
  quantidade: number;
  imagem?: string;    // URL ou base64 da imagem
}

export default function EstoqueScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: "001",
      nome: "Peppers",
      preco: 4.5,
      quantidade: 10,
      imagem: "https://via.placeholder.com/50/FF0000/FFFFFF?text=Peppers",
    },
    {
      id: "002",
      nome: "Eggplant",
      preco: 6.0,
      quantidade: 5,
      imagem: "https://via.placeholder.com/50/800080/FFFFFF?text=Eggplant",
    },
  ]);

  // Estados para gerenciar modais
  const [scannerModalVisible, setScannerModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);

  // Scanner states
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Form states para novo produto
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [imagem, setImagem] = useState("");

  // Funções de manipulação do estoque
  const adicionarProduto = (produto: Produto) => {
    setProdutos((prev) => {
      // Se já existir um produto com o mesmo ID, podemos alertar ou atualizar
      const index = prev.findIndex((p) => p.id === produto.id);
      if (index !== -1) {
        Alert.alert("Erro", "Já existe um produto com esse código de barras!");
        return prev;
      }
      return [...prev, produto];
    });
  };

  const removerProduto = (id: string) => {
    setProdutos((prev) => prev.filter((produto) => produto.id !== id));
  };

  const aumentarQuantidade = (id: string) => {
    setProdutos((prev) =>
      prev.map((produto) =>
        produto.id === id
          ? { ...produto, quantidade: produto.quantidade + 1 }
          : produto
      )
    );
  };

  const diminuirQuantidade = (id: string) => {
    setProdutos((prev) =>
      prev.map((produto) =>
        produto.id === id && produto.quantidade > 0
          ? { ...produto, quantidade: produto.quantidade - 1 }
          : produto
      )
    );
  };

  // Função chamada após o scan
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      setScannedCode(data);
      // Fecha o scanner depois de 1s
      setTimeout(() => {
        setScanned(false);
        setScannerModalVisible(false);
        // Abre o form modal para preencher dados do produto
        setFormModalVisible(true);
      }, 1000);
    }
  };

  // Função para salvar o novo produto no form
  const handleSalvarNovoProduto = () => {
    if (!nome || !preco || !quantidade) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    const novoProduto: Produto = {
      id: scannedCode || Math.random().toString(),
      nome,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      imagem: imagem || "https://via.placeholder.com/50",
    };
    adicionarProduto(novoProduto);
    // Limpa estados
    setNome("");
    setPreco("");
    setQuantidade("");
    setImagem("");
    setScannedCode(null);
    setFormModalVisible(false);
  };

  // Render item do estoque
  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.produto}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {item.imagem && (
          <Image
            source={{ uri: item.imagem }}
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
        )}
        <View>
          <Text style={{ fontWeight: "bold" }}>{item.nome}</Text>
          <Text>R$ {item.preco.toFixed(2)}</Text>
          <Text>Qtd: {item.quantidade}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button title="-" onPress={() => diminuirQuantidade(item.id)} />
        <Button title="+" onPress={() => aumentarQuantidade(item.id)} />
        <Button
          title="Remover"
          color="red"
          onPress={() => removerProduto(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* Botão para adicionar novo produto */}
      <Button
        title="Adicionar novo produto"
        onPress={() => setScannerModalVisible(true)}
      />

      {/* Modal do Scanner */}
      <Modal
        visible={scannerModalVisible}
        animationType="slide"
        onRequestClose={() => setScannerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Escaneie o código de barras</Text>
          <View style={styles.scannerArea}>
            <CameraView
              style={styles.camera}
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

      {/* Modal do Formulário de Cadastro */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cadastrar Produto</Text>
          <Text style={styles.infoText}>
            Código de Barras:{" "}
            {scannedCode ? scannedCode : "Nenhum (será gerado aleatório)"}
          </Text>
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
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          {/* Exemplo de placeholder para a imagem */}
          <TextInput
            style={styles.input}
            placeholder="URL da Imagem (opcional)"
            value={imagem}
            onChangeText={setImagem}
          />
          {/* Aqui você poderia adicionar um botão para abrir a galeria (expo-image-picker) */}

          <View style={styles.buttonsRow}>
            <Button title="Salvar" onPress={handleSalvarNovoProduto} />
            <Button
              title="Cancelar"
              color="red"
              onPress={() => setFormModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
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
  produto: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
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
  scannerArea: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  infoText: {
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
