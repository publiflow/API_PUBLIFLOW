import { prisma } from '../database/prisma';
import type { PF_postagem } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import multerConfig from '../config/multerConfig';

class PostagemService {
  /**
   *
   * @param data Dados da nova postagem, exceto ID e data de publicação
   * @returns
   * Cria uma nova postagem no banco de dados.
   */
  public async createPost(
    data: Omit<PF_postagem, 'id' | 'dataPublicacao'>,
  ): Promise<PF_postagem> {
    return prisma.pF_postagem.create({
      data,
    });
  }

  /**
   *
   * @param id ID da postagem a ser atualizada
   * @param data
   * @returns
   * Atualiza uma postagem existente. Se uma nova imagem for fornecida, a imagem antiga será removida do servidor.
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
   *
   * @param id ID da postagem a ser deletada
   * @returns void
   * Deleta uma postagem e a imagem associada, se existir.
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

    await prisma.pF_postagem.delete({
      where: { id },
    });
  }

  /**
   *
   * @returns Lista de todas as postagens
   * Retorna todas as postagens do banco de dados.
   */
  public async getAllPosts(): Promise<PF_postagem[]> {
    return prisma.pF_postagem.findMany();
  }

  /**
   *
   * @param id ID da postagem a ser buscada
   * @returns
   * Retorna uma postagem específica pelo ID.
   */
  public async getPostById(id: number): Promise<PF_postagem | null> {
    return prisma.pF_postagem.findUnique({
      where: { id },
    });
  }

  /**
   *
   * @returns Lista de postagens visíveis ordenadas por data de publicação
   * Retorna as postagens visíveis ordenadas por data de publicação (mais recentes primeiro).
   */
  public async getFeedPosts(): Promise<PF_postagem[]> {
    return prisma.pF_postagem.findMany({
      where: { visibilidade: true },
      orderBy: { dataPublicacao: 'desc' },
    });
  }

  /**
   *
   * @param query Termo de busca para filtrar postagens por título ou descrição
   * @returns
   * Retorna postagens visíveis que correspondem ao termo de busca no título ou descrição.
   */
  public async searchPosts(query: string): Promise<PF_postagem[]> {
    return prisma.pF_postagem.findMany({
      where: {
        visibilidade: true,
        OR: [
          { titulo: { contains: query, mode: 'insensitive' } },
          { descricao: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { dataPublicacao: 'desc' },
    });
  }
}

export default new PostagemService();

