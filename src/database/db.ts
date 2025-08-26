import { Pool } from 'pg';
import dotenv from 'dotenv'; 

dotenv.config(); 

const criaConexaoBancoDeDadosPostgres = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export async function conexaoBancoDeDados(){
  try {
      await criaConexaoBancoDeDadosPostgres.connect();
  } catch (erro) {
    throw new Error("Erro na conexão do banco de dados: " + erro);
  }
}