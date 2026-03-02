import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import phraseService from '../services/phrase.service';
import { AppError } from '../middleware/errorHandler';

export class PhraseController {
  // Topic controllers
  async getAllTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, sortBy, order, page, limit } = req.query;
      const topics = await phraseService.getAllTopics({
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
      const topic = await phraseService.getTopicById(topicId);
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
      const topic = await phraseService.createTopic(name);

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
      const topic = await phraseService.updateTopic(topicId, name);

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
      await phraseService.deleteTopic(topicId);

      res.json({
        success: true,
        message: 'Topic deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Phrase controllers
  async getPhrasesByTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const { search, sortBy, order, page, limit } = req.query;
      const phrases = await phraseService.getPhrasesByTopic(topicId, {
        search: search as string,
        sortBy: sortBy as string,
        order: order as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: phrases.data,
        pagination: phrases.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPhraseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phraseId } = req.params;
      const phrase = await phraseService.getPhraseById(phraseId);

      res.json({
        success: true,
        data: phrase,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPhrase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const phrase = await phraseService.createPhrase(req.body);

      res.status(201).json({
        success: true,
        data: phrase,
        message: 'Phrase created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePhrase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { phraseId } = req.params;
      const phrase = await phraseService.updatePhrase(phraseId, req.body);

      res.json({
        success: true,
        data: phrase,
        message: 'Phrase updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePhrase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phraseId } = req.params;
      await phraseService.deletePhrase(phraseId);

      res.json({
        success: true,
        message: 'Phrase deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async importTopicWithPhrases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const result = await phraseService.importTopicWithPhrases(req.body);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Topic and phrases imported successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Practice controllers
  async getRandomPhrases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const phrases = await phraseService.getRandomPhrases(topicId, limit);

      res.json({
        success: true,
        data: phrases,
      });
    } catch (error) {
      next(error);
    }
  }

  async incrementPracticeCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phraseId } = req.params;
      const phrase = await phraseService.incrementPracticeCount(phraseId);

      res.json({
        success: true,
        data: phrase,
        message: 'Practice count incremented successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async incrementWrongCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phraseId } = req.params;
      const phrase = await phraseService.incrementWrongCount(phraseId);

      res.json({
        success: true,
        data: phrase,
        message: 'Wrong count incremented successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PhraseController();
