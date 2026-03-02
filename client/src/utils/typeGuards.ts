import { VocabularyTopic, VocabularyWord, PhraseTopic, Phrase } from '../types';
import { ApiResponse } from '../types/api.types';

// Type guard helper functions
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => isString(item));
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

// Vocabulary Topic validation
export function isVocabularyTopic(obj: unknown): obj is VocabularyTopic {
  if (typeof obj !== 'object' || obj === null) return false;
  const topic = obj as Record<string, unknown>;

  return (
    isString(topic._id) &&
    isString(topic.name) &&
    isNumber(topic.wordCount) &&
    isString(topic.createdAt) &&
    isString(topic.updatedAt)
  );
}

export function isVocabularyTopicArray(arr: unknown): arr is VocabularyTopic[] {
  return Array.isArray(arr) && arr.every(isVocabularyTopic);
}

// Vocabulary Word validation
export function isVocabularyWord(obj: unknown): obj is VocabularyWord {
  if (typeof obj !== 'object' || obj === null) return false;
  const word = obj as Record<string, unknown>;

  return (
    isString(word._id) &&
    isString(word.topicId) &&
    isString(word.word) &&
    isString(word.type) &&
    isString(word.IPA) &&
    isString(word.definition) &&
    isStringArray(word.exampleSentences) &&
    isOptionalString(word.image) &&
    isString(word.createdAt) &&
    isString(word.updatedAt)
  );
}

export function isVocabularyWordArray(arr: unknown): arr is VocabularyWord[] {
  return Array.isArray(arr) && arr.every(isVocabularyWord);
}

// Phrase Topic validation
export function isPhraseTopic(obj: unknown): obj is PhraseTopic {
  if (typeof obj !== 'object' || obj === null) return false;
  const topic = obj as Record<string, unknown>;

  return (
    isString(topic._id) &&
    isString(topic.name) &&
    isNumber(topic.phraseCount) &&
    isString(topic.createdAt) &&
    isString(topic.updatedAt)
  );
}

export function isPhraseTopicArray(arr: unknown): arr is PhraseTopic[] {
  return Array.isArray(arr) && arr.every(isPhraseTopic);
}

// Phrase validation
export function isPhrase(obj: unknown): obj is Phrase {
  if (typeof obj !== 'object' || obj === null) return false;
  const phrase = obj as Record<string, unknown>;

  return (
    isString(phrase._id) &&
    isString(phrase.topicId) &&
    isString(phrase.phrase) &&
    isString(phrase.definition) &&
    isStringArray(phrase.exampleSentences) &&
    isOptionalString(phrase.image) &&
    isString(phrase.createdAt) &&
    isString(phrase.updatedAt)
  );
}

export function isPhraseArray(arr: unknown): arr is Phrase[] {
  return Array.isArray(arr) && arr.every(isPhrase);
}

// API Response validation
export function isApiResponse<T>(
  obj: unknown,
  dataValidator: (data: unknown) => data is T
): obj is ApiResponse<T> {
  if (typeof obj !== 'object' || obj === null) return false;
  const response = obj as Record<string, unknown>;

  return (
    typeof response.success === 'boolean' &&
    response.success === true &&
    dataValidator(response.data)
  );
}

// Generic validator that throws on invalid data
export function validateApiResponse<T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  errorMessage: string
): T {
  if (!isApiResponse(data, validator)) {
    console.error('Invalid API response:', data);
    throw new Error(errorMessage);
  }
  return data.data;
}
