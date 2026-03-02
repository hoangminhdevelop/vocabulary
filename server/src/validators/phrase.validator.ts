import { body } from 'express-validator';

export const createTopicValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Topic name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic name must be between 2 and 100 characters'),
];

export const createPhraseValidator = [
  body('topicId')
    .notEmpty()
    .withMessage('Topic ID is required')
    .isMongoId()
    .withMessage('Invalid topic ID'),
  body('phrase').trim().notEmpty().withMessage('Phrase is required'),
  body('definition').trim().notEmpty().withMessage('Definition is required'),
  body('exampleSentences').optional().isArray().withMessage('Example sentences must be an array'),
  body('image').optional().isString().withMessage('Image must be a string'),
];

export const updatePhraseValidator = [
  body('phrase').optional().trim().notEmpty().withMessage('Phrase cannot be empty'),
  body('definition').optional().trim().notEmpty().withMessage('Definition cannot be empty'),
  body('exampleSentences').optional().isArray().withMessage('Example sentences must be an array'),
  body('image').optional().isString().withMessage('Image must be a string'),
  body('practiceCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Practice count must be a non-negative integer'),
  body('wrongCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Wrong count must be a non-negative integer'),
  body('isLearned').optional().isBoolean().withMessage('isLearned must be a boolean'),
];

export const importTopicValidator = [
  body('topic').trim().notEmpty().withMessage('Topic name is required'),
  body('phrases')
    .isArray({ min: 1 })
    .withMessage('Phrases array is required and must contain at least one phrase'),
  body('phrases.*.phrase').trim().notEmpty().withMessage('Each phrase must have a phrase field'),
  body('phrases.*.definition')
    .trim()
    .notEmpty()
    .withMessage('Each phrase must have a definition field'),
];
