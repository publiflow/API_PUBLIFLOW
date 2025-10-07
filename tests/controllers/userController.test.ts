import request from "supertest";
import app from "../../src/index";
import {prisma} from "../../src/database/prisma";

beforeEach(async () => {
  await prisma.pF_usuario.deleteMany({});
});

describe("Testando rota /api/users", () => {
  it("Criação de usuário", async () => {
    const userData = {
      nome: 'cristhian',
      sobrenome: 'mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    }
    const response = await request(app).post("/api/users").send(userData);

    const expectedResponse = {
      ...userData,
      nomeCompleto: `${userData.nome} ${userData.sobrenome}`,
      id: expect.any(Number),
      dataCadastro: expect.any(String),
    };
    //delete expectedResponse.nome;
    //delete expectedResponse.sobrenome;
    //delete expectedResponse.senha; // Senha não deve ser retornada

    expect(response.body).toEqual(expect.objectContaining(expectedResponse));
    expect(response.status).toBe(201);
  });

  it("Lista usuário por id", async () => {
    const userData = {
      nome: 'cristhian',
      sobrenome: 'mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123', 
    }
    const createUserResponse = await request(app).post("/api/users").send(userData);
    const userId = createUserResponse.body.id;
    const getUserResponse = await request(app).get(`/api/users/${userId}`);
    
    const expectedResponse = {
      ...userData,
      nomeCompleto: `${userData.nome} ${userData.sobrenome}`,
      id: userId,
      dataCadastro: expect.any(String),
    };
    //delete expectedResponse.nome;
    //delete expectedResponse.sobrenome;
    //delete expectedResponse.senha; // Senha não deve ser retornada

    expect(getUserResponse.statusCode).toBe(200);
    expect(getUserResponse.body).toEqual(expect.objectContaining(expectedResponse));
  });

  it("Lista todos os usuários", async () => {
    const getUserResponse = await request(app).get(`/api/users`);
    
    expect(getUserResponse.statusCode).toBe(200);
    expect(Array.isArray(getUserResponse.body)).toBe(true);
  });

   it("Atualiza usuário", async () => {
    const userData = {
      nome: 'cristhian',
      sobrenome: 'mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    }
    const createUserResponse = await request(app).post("/api/users").send(userData);
    const userId = createUserResponse.body.id;

    const updatedUserData = {
      email: 'email_novo@gmail.com',
    }
    const updateUserResponse = await request(app).put(`/api/users/${userId}`).send(updatedUserData);

    expect(updateUserResponse.statusCode).toBe(200);
    expect(updateUserResponse.body.email).toBe(updatedUserData.email);
    
  });

  it("Deletar usuário", async () => {
    const userData = {
      nome: 'cristhian',
      sobrenome: 'mendes',
      telefone: '11933049341',
      email: 'cris456mendes@gmail.com',
      papelUsuarioID: 1,
      senha: '123',
    }
    const createUserResponse = await request(app).post("/api/users").send(userData);

    const getUserResponse = await request(app).delete(`/api/users/${createUserResponse.body.id}`);
    
    expect(getUserResponse.statusCode).toBe(204);
  });

    it("Rota root", async () => {
    
    const rootRoute = await request(app).get("/");
    
    expect(rootRoute.body).toEqual("API Publiflow - Bem-vindo!");
  });
});