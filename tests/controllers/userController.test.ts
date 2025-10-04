import request from 'supertest';
import app from '../../src/index';
import { prisma } from '../../src/database/prisma';

// --- CONFIGURAÇÕES INICIAIS ---
beforeEach(async () => {
  await prisma.pF_usuario.deleteMany({});
  await prisma.pF_papelUsuario.deleteMany({});

  await prisma.pF_papelUsuario.create({
    data: {
      id: 1,
      papelUsuario: 'Aluno',
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Testando rota /api/users', () => {
  it('Deve criar o usuário "Cristhian Mendes"', async () => {
    const userData = {
      nomeCompleto: 'Cristhian Mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    };

    const response = await request(app).post('/api/users').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        nomeCompleto: 'Cristhian Mendes',
        email: 'cris456mendes@gmail.com',
      }),
    );
    expect(response.body).toHaveProperty('id');
  });

  it('Deve listar o usuário "Cristhian Mendes" pelo seu ID', async () => {
    const userData = {
      nomeCompleto: 'Cristhian Mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    };
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);
    const userId = createUserResponse.body.id;

    const getUserResponse = await request(app).get(`/api/users/${userId}`);

    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body.id).toBe(userId);
    expect(getUserResponse.body.nomeCompleto).toBe('Cristhian Mendes');
  });

  it('Deve listar todos os usuários criados', async () => {
    await request(app).post('/api/users').send({
      nomeCompleto: 'Cristhian Mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    });

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nomeCompleto).toBe('Cristhian Mendes');
  });

  it('Deve atualizar o usuário "Cristhian Mendes" para "João Gomes"', async () => {
    const initialUserResponse = await request(app).post('/api/users').send({
      nomeCompleto: 'Cristhian Mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    });
    const userId = initialUserResponse.body.id;

    const updatedUserData = {
      nomeCompleto: 'João Gomes',
      telefone: '11942567718',
      email: 'joaozinho@gmail.com.br',
      senha: '123456',
    };

    const updateResponse = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedUserData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.nomeCompleto).toBe('João Gomes');
    expect(updateResponse.body.email).toBe('joaozinho@gmail.com.br');
  });

  it('Deve deletar o usuário "João Gomes" após a atualização', async () => {
    //-- Cria o usuário "Cristhian Mendes"
    const initialUserResponse = await request(app).post('/api/users').send({
      nomeCompleto: 'Cristhian Mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    });
    const userId = initialUserResponse.body.id;

    //-- Atualiza o usuário para "João Gomes"
    await request(app).put(`/api/users/${userId}`).send({
      nomeCompleto: 'João Gomes',
      telefone: '11942567718',
      email: 'joaozinho@gmail.com.br',
      senha: '123456',
    });

    //-- Deleta o usuário (que agora é João Gomes)
    const deleteResponse = await request(app).delete(`/api/users/${userId}`);
    expect(deleteResponse.status).toBe(204);

    //-- Tenta buscar o usuário deletado e espera um erro 404
    const getResponse = await request(app).get(`/api/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});

