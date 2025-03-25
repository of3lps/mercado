const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET: Lista todos os produtos
router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// POST: Cria um novo produto
router.post("/", async (req, res) => {
  try {
    const { nome, preco, quantidade, imagem } = req.body;
    const novoProduto = await prisma.produto.create({
      data: { nome, preco, quantidade, imagem },
    });
    res.json(novoProduto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// PUT: Atualiza um produto existente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, quantidade, imagem } = req.body;
    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: { nome, preco, quantidade, imagem },
    });
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// DELETE: Remove um produto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produto.delete({ where: { id: Number(id) } });
    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover produto" });
  }
});

module.exports = router;
