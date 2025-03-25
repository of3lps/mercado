const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importa as rotas
const produtoRoutes = require("./routes/produtos");

app.use("/produtos", produtoRoutes);

// Rota simples de teste
app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
