import express from 'express';
import dotenv from 'dotenv';
import mainRouter from './routes/index.js';

//-- Importe o swagger-ui e a sua configuração
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT;

app.use(express.json());

//-- Crie a rota para a documentação do Swagger
//-- Esta rota deve vir ANTES das rotas da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

