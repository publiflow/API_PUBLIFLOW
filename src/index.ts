import express from "express";
import dotenv from "dotenv";
import { conexaoBancoDeDados } from "./database/db";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

conexaoBancoDeDados();