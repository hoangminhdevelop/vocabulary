import { Router } from 'express';
import phraseController from '../controllers/phrase.controller';
import {
  createTopicValidator,
  createPhraseValidator,
  updatePhraseValidator,
  importTopicValidator,
} from '../validators/phrase.validator';

const router = Router();

// Topic routes
router.get('/topics', phraseController.getAllTopics);
router.get('/topics/:topicId', phraseController.getTopicById);
router.post('/topics', createTopicValidator, phraseController.createTopic);
router.put('/topics/:topicId', createTopicValidator, phraseController.updateTopic);
router.delete('/topics/:topicId', phraseController.deleteTopic);

// Phrase routes
router.get('/topics/:topicId/phrases', phraseController.getPhrasesByTopic);
router.get('/phrases/:phraseId', phraseController.getPhraseById);
router.post('/phrases', createPhraseValidator, phraseController.createPhrase);
router.put('/phrases/:phraseId', updatePhraseValidator, phraseController.updatePhrase);
router.delete('/phrases/:phraseId', phraseController.deletePhrase);

// Import route
router.post('/import', importTopicValidator, phraseController.importTopicWithPhrases);

// Practice routes
router.get('/topics/:topicId/phrases/random', phraseController.getRandomPhrases);
router.patch('/phrases/:phraseId/practice', phraseController.incrementPracticeCount);
router.patch('/phrases/:phraseId/wrong', phraseController.incrementWrongCount);

export default router;
