import { Router } from 'express';
import vocabularyController from '../controllers/vocabulary.controller';
import {
  createTopicValidator,
  createWordValidator,
  updateWordValidator,
  importTopicValidator,
} from '../validators/vocabulary.validator';

const router = Router();

// Topic routes
router.get('/topics', vocabularyController.getAllTopics);
router.get('/topics/:topicId', vocabularyController.getTopicById);
router.post('/topics', createTopicValidator, vocabularyController.createTopic);
router.put('/topics/:topicId', createTopicValidator, vocabularyController.updateTopic);
router.delete('/topics/:topicId', vocabularyController.deleteTopic);

// Word routes
router.get('/topics/:topicId/words', vocabularyController.getWordsByTopic);
router.get('/words/:wordId', vocabularyController.getWordById);
router.post('/words', createWordValidator, vocabularyController.createWord);
router.put('/words/:wordId', updateWordValidator, vocabularyController.updateWord);
router.delete('/words/:wordId', vocabularyController.deleteWord);

// Import route
router.post('/import', importTopicValidator, vocabularyController.importTopicWithWords);

// Practice routes
router.get('/topics/:topicId/words/random', vocabularyController.getRandomWords);
router.patch('/words/:wordId/practice', vocabularyController.incrementPracticeCount);
router.patch('/words/:wordId/wrong', vocabularyController.incrementWrongCount);

export default router;
