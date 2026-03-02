import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import vocabularyService from '../services/vocabulary.service';
import { AppError } from '../middleware/errorHandler';

export class VocabularyController {
  // Topic controllers
  async getAllTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, sortBy, order, page, limit } = req.query;
      const topics = await vocabularyService.getAllTopics({
        search: search as string,
        sortBy: sortBy as string,
        order: order as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json({
        success: true,
        data: topics.data,
        pagination: topics.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopicById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const topic = await vocabularyService.getTopicById(topicId);
      res.json({
        success: true,
        data: topic,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { name } = req.body;
      const topic = await vocabularyService.createTopic(name);

      res.status(201).json({
        success: true,
        data: topic,
        message: 'Topic created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { topicId } = req.params;
      const { name } = req.body;
      const topic = await vocabularyService.updateTopic(topicId, name);

      res.json({
        success: true,
        data: topic,
        message: 'Topic updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      await vocabularyService.deleteTopic(topicId);

      res.json({
        success: true,
        message: 'Topic deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Word controllers
  async getWordsByTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const { search, sortBy, order, page, limit } = req.query;
      const words = await vocabularyService.getWordsByTopic(topicId, {
        search: search as string,
        sortBy: sortBy as string,
        order: order as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: words.data,
        pagination: words.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWordById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { wordId } = req.params;
      const word = await vocabularyService.getWordById(wordId);

      res.json({
        success: true,
        data: word,
      });
    } catch (error) {
      next(error);
    }
  }

  async createWord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const word = await vocabularyService.createWord(req.body);

      res.status(201).json({
        success: true,
        data: word,
        message: 'Word created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateWord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { wordId } = req.params;
      const word = await vocabularyService.updateWord(wordId, req.body);

      res.json({
        success: true,
        data: word,
        message: 'Word updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteWord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { wordId } = req.params;
      await vocabularyService.deleteWord(wordId);

      res.json({
        success: true,
        message: 'Word deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async importTopicWithWords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const result = await vocabularyService.importTopicWithWords(req.body);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Topic and words imported successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Practice controllers
  async getRandomWords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const words = await vocabularyService.getRandomWords(topicId, limit);

      res.json({
        success: true,
        data: words,
      });
    } catch (error) {
      next(error);
    }
  }

  async incrementPracticeCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { wordId } = req.params;
      const word = await vocabularyService.incrementPracticeCount(wordId);

      res.json({
        success: true,
        data: word,
        message: 'Practice count incremented successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async incrementWrongCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { wordId } = req.params;
      const word = await vocabularyService.incrementWrongCount(wordId);

      res.json({
        success: true,
        data: word,
        message: 'Wrong count incremented successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VocabularyController();
