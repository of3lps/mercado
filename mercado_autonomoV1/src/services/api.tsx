const produtosMock = [
    { id: "1", nome: "Refrigerante", preco: 5.99, estoque: 10 },
    { id: "2", nome: "Chocolate", preco: 3.50, estoque: 20 },
    { id: "3", nome: "Biscoito", preco: 2.99, estoque: 15 },
  ];
  
  export function buscarProdutos() {
    return produtosMock;
  }
  
  export function buscarProdutoPorCodigo(codigo) {
    return produtosMock.find((p) => p.id === codigo);
  }
  
  export function atualizarEstoque(id, quantidade) {
    const produto = produtosMock.find((p) => p.id === id);
    if (produto) {
      produto.estoque -= quantidade;
    }
  }
  