import request from "supertest";
import app from "../../src/index"  

describe("Testando rota /api/users", () => {
  it("Criação de usuário", async () => {
    const userData = {
    id: 1,
    nome: 'cristhian',
    sobrenome: 'mendes',
    telefone: '11933049341',
    email: 'cris456mendes@gmail.com',
    papelUsuarioID: 1,
    senha: '123',
    dataCadastro: new Date(2025, 8, 28)
    }
    const response = await request(app).post("/api/users").send(userData);

    expect(response.body).toEqual(expect.objectContaining(userData));
    expect(response.status).toBe(201);
  });

  it("Lista usuário por id", async () => {
    const userData = {
    id: 1,
    nome: 'cristhian',
    sobrenome: 'mendes',
    telefone: '11933049341',
    email: 'cris456mendes@gmail.com',
    papelUsuarioID: 1,
    senha: '123',
    dataCadastro: new Date(2025, 8, 28)
    }
    const createUserResponse = await request(app).post("/api/users").send(userData);
    const userId = createUserResponse.body.id;
    const getUserResponse = await request(app).get(`/api/users/${userId}`);
    
    expect(getUserResponse.statusCode).toBe(200);
    expect(getUserResponse.body).toEqual(expect.objectContaining(userData));
  });

  it("Lista todos os usuários", async () => {
    const userData = {
    id: 1,
    nome: 'cristhian',
    sobrenome: 'mendes',
    telefone: '11933049341',
    email: 'cris456mendes@gmail.com',
    papelUsuarioID: 1,
    senha: '123',
    dataCadastro: new Date(2025, 8, 28)
    }
    const createUserResponse = await request(app).post("/api/users").send(userData);
    const getUserResponse = await request(app).get(`/api/users`);
    
    expect(getUserResponse.statusCode).toBe(200);
  });

   it("Atualiza usuário", async () => {
    const userData = {
    id: 1,
    nome: 'cristhian',
    sobrenome: 'mendes',
    telefone: '11933049341',
    email: 'cris456mendes@gmail.com',
    papelUsuarioID: 1,
    senha: '123',
    dataCadastro: new Date(2025, 8, 28)
    }
    const createUserResponse = await request(app).post("/api/users").send(userData);

    const updatedUserData = {
    id: 1,
    nome: 'João',
    sobrenome: 'Gomes',
    telefone: '11942567718',
    email: 'joaozinho@gmail.com.br',
    papelUsuarioID: 1,
    senha: '123456',
    dataCadastro: new Date(2025, 8, 28)
    }
    const getUserResponse = await request(app).get(`/api/users`);
    
    expect(getUserResponse.statusCode).toBe(200);
  });
});