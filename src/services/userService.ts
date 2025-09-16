import { prisma } from '../database/prisma.js';
import type { PF_usuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

class UsuarioService {
  /**
   * Função para CRIAR um novo usuário
   * @param data
   * @returns
   */
  public async create(
    data: Omit<PF_usuario, 'id' | 'dataCadastro'>,
  ): Promise<PF_usuario> {
    const emailExistente = await prisma.pF_usuario.findUnique({
      where: { email: data.email },
    });
    if (emailExistente) {
      throw new Error('Este e-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.senha, 10);

    return prisma.pF_usuario.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });
  }

  /**
   * Função para LISTAR todos os usuários
   * @returns
   */
  public async getAll(): Promise<PF_usuario[]> {
    return prisma.pF_usuario.findMany();
  }

  /**
   * Função para BUSCAR um usuário pelo ID
   * @param id
   * @returns
   */
  public async getById(id: number): Promise<PF_usuario | null> {
    return prisma.pF_usuario.findUnique({
      where: { id },
    });
  }

  /**
   * Função para ATUALIZAR um usuário
   * @param id
   * @param data
   * @returns
   */
  public async update(
    id: number,
    data: Partial<PF_usuario>,
  ): Promise<PF_usuario> {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    if (data.email) {
      const emailExistente = await prisma.pF_usuario.findUnique({
        where: { email: data.email },
      });

      //-- Se o e-mail existe E pertence a um usuário diferente, lança um erro
      if (emailExistente && emailExistente.id !== id) {
        throw new Error('Este e-mail já está em uso por outro usuário.');
      }
    }

    return prisma.pF_usuario.update({
      where: { id },
      data,
    });
  }

  /**
   * Função para deletar um usuário
   * @param id
   */
  public async delete(id: number): Promise<void> {
    await prisma.pF_usuario.delete({
      where: { id },
    });
  }
}

// Exportamos uma instância da classe para ser usada no projeto
export default new UsuarioService();

