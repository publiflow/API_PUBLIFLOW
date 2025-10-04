import request from 'supertest';
import app from '../../src/index';
import { prisma } from '../../src/database/prisma';
import path from 'path';
import fs from 'fs';

// --- CONFIGURAÇÕES INICIAIS ---
let authorId: number;

beforeEach(async () => {
  //-- Limpa o banco de dados para garantir um ambiente isolado
  await prisma.pF_postagem.deleteMany({});
  await prisma.pF_usuario.deleteMany({});
  await prisma.pF_papelUsuario.deleteMany({});

  //-- Cria o papel de usuário necessário
  await prisma.pF_papelUsuario.create({
    data: { id: 1, papelUsuario: 'Aluno' },
  });

  //-- Cria um usuário "Cristhian Mendes" que será usado para criar as postagens
  const author = await prisma.pF_usuario.create({
    data: {
      nomeCompleto: 'Cristhian Mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    },
  });
  authorId = author.id; // Guarda o ID do autor para usar nos testes
});

//-- Executado uma vez, no final de todos os testes
afterAll(async () => {
  await prisma.$disconnect();
});

// --- SUÍTE DE TESTES PARA POSTAGENS ---
describe('Testando rota /api/posts', () => {
  it('Deve criar uma nova postagem com imagem', async () => {
    //-- Caminho para a imagem de teste que você criou
    const imagePath = path.join(__dirname, '..', 'assets', 'test-image.png');

    //-- Cria um arquivo de imagem simples se ele não existir
    if (!fs.existsSync(imagePath)) {
      if (!fs.existsSync(path.dirname(imagePath))) {
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      }
      fs.writeFileSync(imagePath, 'fake image data');
    }

    const response = await request(app)
      .post('/api/posts')
      .field('titulo', 'Meu Primeiro Post') // .field() para campos de texto
      .field('descricao', 'Esta é a descrição do meu primeiro post.')
      .field('visibilidade', 'true')
      .field('autorID', authorId.toString())
      .attach('imagem', imagePath); // .attach() para o arquivo de imagem

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe('Meu Primeiro Post');
    expect(response.body.autorID).toBe(authorId);
  });

  it('Deve listar todas as postagens', async () => {
    //-- Cria uma postagem para garantir que a lista não esteja vazia
    await prisma.pF_postagem.create({
      data: {
        titulo: 'Post para Listagem',
        descricao: '...',
        visibilidade: true,
        caminhoImagem: 'fake-path.jpg',
        autorID: authorId,
      },
    });

    //-- Faz a requisição para buscar todas as postagens
    const response = await request(app).get('/api/posts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].titulo).toBe('Post para Listagem');
  });

  it('Deve buscar uma postagem pelo ID', async () => {
    const post = await prisma.pF_postagem.create({
      data: {
        titulo: 'Post para Busca por ID',
        descricao: '...',
        visibilidade: true,
        caminhoImagem: 'fake-path.jpg',
        autorID: authorId,
      },
    });

    const response = await request(app).get(`/api/posts/${post.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(post.id);
    expect(response.body.titulo).toBe('Post para Busca por ID');
  });

  it('Deve deletar uma postagem', async () => {
    const post = await prisma.pF_postagem.create({
      data: {
        titulo: 'Post a ser Deletado',
        descricao: '...',
        visibilidade: true,
        caminhoImagem: 'fake-path.jpg',
        autorID: authorId,
      },
    });

    //-- Deleta a postagem
    const deleteResponse = await request(app).delete(`/api/posts/${post.id}`);
    expect(deleteResponse.status).toBe(204);

    //-- Tenta buscar a postagem deletada e espera um erro 404
    const getResponse = await request(app).get(`/api/posts/${post.id}`);
    expect(getResponse.status).toBe(404);
  });
});

