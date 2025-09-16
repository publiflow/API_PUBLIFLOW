import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PubliFlow API',
      version: '1.0.0',
      description: 'API para a plataforma de postagem de conteúdo PubliFlow',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    //-- Centralizando as definições reutilizáveis
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          required: [
            'nomeCompleto',
            'email',
            'senha',
            'telefone',
            'papelUsuarioID',
          ],
          properties: {
            id: {
              type: 'integer',
              description: 'ID auto-gerado do usuário.',
              readOnly: true, // Indica que este campo não é esperado em requisições de criação/atualização
            },
            nomeCompleto: {
              type: 'string',
              description: 'Nome completo do usuário.',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do usuário.',
            },
            senha: {
              type: 'string',
              format: 'password',
              description:
                'Senha do usuário (não será retornada nas respostas).',
            },
            telefone: {
              type: 'string',
              description: 'Telefone do usuário.',
            },
            papelUsuarioID: {
              type: 'integer',
              description: 'ID do papel do usuário.',
            },
            dataCadastro: {
              type: 'string',
              format: 'date-time',
              description: 'Data de cadastro do usuário.',
              readOnly: true,
            },
          },
          example: {
            nomeCompleto: 'Jane Doe',
            email: 'jane.doe@example.com',
            senha: 'password123',
            telefone: '11987654321',
            papelUsuarioID: 1,
          },
        },
      },
    },
  },
  //-- Caminho para os arquivos que contêm as anotações da API
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

