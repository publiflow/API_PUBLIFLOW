import type { Request, Response } from 'express';
import PostagemService from '../services/postagemService.js';

class PostagemController {
  /**
   * Função para criar uma nova postagem com imagem.
   */
  public async create(req: Request, res: Response) {
    try {
      const { titulo, descricao, visibilidade, autorID } = req.body;

      // Pega o nome do arquivo salvo pelo multer
      const nomeDoArquivo = req.file?.filename;

      if (!nomeDoArquivo) {
        return res
          .status(400)
          .json({ message: 'O envio de uma imagem é obrigatório.' });
      }

      // Chama o serviço usando 'caminhoImagem'
      const post = await PostagemService.createPost({
        titulo,
        descricao,
        visibilidade: visibilidade === 'true',
        autorID: parseInt(autorID),
        caminhoImagem: nomeDoArquivo, // Atribui o nome do arquivo ao campo correto
      });

      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Função para atualizar uma postagem.
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da postagem não fornecido' });
    }

    try {
      const dadosParaAtualizar: { [key: string]: any } = { ...req.body };

      // Se uma nova imagem foi enviada, adiciona o caminho dela ao objeto de atualização
      if (req.file) {
        dadosParaAtualizar.caminhoImagem = req.file.filename;
      }

      if (dadosParaAtualizar.visibilidade !== undefined) {
        dadosParaAtualizar.visibilidade =
          dadosParaAtualizar.visibilidade === 'true';
      }
      if (dadosParaAtualizar.autorID !== undefined) {
        dadosParaAtualizar.autorID = parseInt(dadosParaAtualizar.autorID);
      }

      const post = await PostagemService.updatePost(
        parseInt(id),
        dadosParaAtualizar,
      );
      res.status(200).json(post);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Postagem não encontrada.' });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // --- Os métodos abaixo não precisam de alterações ---

  public async getAll(req: Request, res: Response) {
    try {
      const posts = await PostagemService.getAllPosts();
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da postagem não fornecido' });
    }

    try {
      const post = await PostagemService.getPostById(parseInt(id));
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Postagem não encontrada' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da postagem não fornecido' });
    }

    try {
      await PostagemService.deletePost(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Postagem não encontrada.' });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

export default new PostagemController();
