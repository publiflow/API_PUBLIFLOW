import express from 'express';
import dotenv from 'dotenv';
import mainRouter from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

//-- Importe o swagger-ui e a sua configuração
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT;

// Workaround para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

//-- Crie a rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//-- Adicione esta linha para servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.send('API Publiflow - Bem-vindo!');
});

//-- Use o roteador principal com o prefixo /api para suas rotas de CRUD
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(
    `Documentação da API disponível em http://localhost:${PORT}/api-docs`,
  );
});

