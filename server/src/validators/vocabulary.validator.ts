import { body } from 'express-validator';

export const createTopicValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Topic name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic name must be between 2 and 100 characters'),
];

export const createWordValidator = [
  body('topicId')
    .notEmpty()
    .withMessage('Topic ID is required')
    .isMongoId()
    .withMessage('Invalid topic ID'),
  body('word').trim().notEmpty().withMessage('Word is required'),
  body('type').trim().notEmpty().withMessage('Word type is required'),
  body('IPA').trim().notEmpty().withMessage('IPA pronunciation is required'),
  body('definition').trim().notEmpty().withMessage('Definition is required'),
  body('exampleSentences').optional().isArray().withMessage('Example sentences must be an array'),
  body('image').optional().isString().withMessage('Image must be a string'),
];

export const updateWordValidator = [
  body('word').optional().trim().notEmpty().withMessage('Word cannot be empty'),
  body('type').optional().trim().notEmpty().withMessage('Word type cannot be empty'),
  body('IPA').optional().trim().notEmpty().withMessage('IPA pronunciation cannot be empty'),
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
  body('words')
    .isArray({ min: 1 })
    .withMessage('Words array is required and must contain at least one word'),
  body('words.*.word').trim().notEmpty().withMessage('Each word must have a word field'),
  body('words.*.type').trim().notEmpty().withMessage('Each word must have a type field'),
  body('words.*.IPA').trim().notEmpty().withMessage('Each word must have an IPA field'),
  body('words.*.definition')
    .trim()
    .notEmpty()
    .withMessage('Each word must have a definition field'),
];
