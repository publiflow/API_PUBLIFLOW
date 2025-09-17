import { prisma } from '../database/prisma.js';
import type { PF_postagem } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import multerConfig from '../config/multerConfig.js';

class PostagemService {
  /**
   * Cria uma nova postagem.
   */
  public async createPost(
    data: Omit<PF_postagem, 'id' | 'dataPublicacao'>,
  ): Promise<PF_postagem> {
    return prisma.pF_postagem.create({
      data,
    });
  }

  /**
   * Atualiza uma postagem.
   */
  public async updatePost(
    id: number,
    data: Partial<PF_postagem>,
  ): Promise<PF_postagem> {
    // Busca a postagem antiga para obter o caminho da imagem anterior
    const postagemAntiga = await prisma.pF_postagem.findUnique({
      where: { id },
    });

    // Se um novo caminho de imagem for enviado e um antigo existir, apaga a imagem antiga
    if (data.caminhoImagem && postagemAntiga?.caminhoImagem) {
      const caminhoImagemAntiga = path.join(
        multerConfig.directory,
        postagemAntiga.caminhoImagem,
      );
      if (fs.existsSync(caminhoImagemAntiga)) {
        fs.unlinkSync(caminhoImagemAntiga);
      }
    }

    // Atualiza a postagem no banco de dados
    return prisma.pF_postagem.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma postagem e sua imagem associada.
   */
  public async deletePost(id: number): Promise<void> {
    const postagem = await prisma.pF_postagem.findUnique({
      where: { id },
    });

    // Se a postagem tiver uma imagem, apaga o arquivo do servidor
    if (postagem?.caminhoImagem) {
      const caminhoImagemFS = path.join(
        multerConfig.directory,
        postagem.caminhoImagem,
      );
      if (fs.existsSync(caminhoImagemFS)) {
        fs.unlinkSync(caminhoImagemFS);
      }
    }

    // Apaga o registro do banco de dados
    await prisma.pF_postagem.delete({
      where: { id },
    });
  }

  // --- Métodos que não precisam de alteração ---

  public async getAllPosts(): Promise<PF_postagem[]> {
    return prisma.pF_postagem.findMany();
  }

  public async getPostById(id: number): Promise<PF_postagem | null> {
    return prisma.pF_postagem.findUnique({
      where: { id },
    });
  }
}

export default new PostagemService();
