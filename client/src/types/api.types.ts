// API Response wrapper types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Request payload types
export interface CreateVocabularyTopicRequest {
  name: string;
}

export interface UpdateVocabularyTopicRequest {
  name: string;
}

export interface CreateVocabularyWordRequest {
  topicId: string;
  word: string;
  type: string;
  IPA: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
}

export interface UpdateVocabularyWordRequest {
  word?: string;
  type?: string;
  IPA?: string;
  definition?: string;
  exampleSentences?: string[];
  image?: string;
  practiceCount?: number;
  wrongCount?: number;
  isLearned?: boolean;
}

export interface ImportVocabularyTopicRequest {
  topic: string;
  words: Array<Omit<CreateVocabularyWordRequest, 'topicId'>>;
}

export interface CreatePhraseTopicRequest {
  name: string;
}

export interface UpdatePhraseTopicRequest {
  name: string;
}

export interface CreatePhraseRequest {
  topicId: string;
  phrase: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
}

export interface UpdatePhraseRequest {
  phrase?: string;
  definition?: string;
  exampleSentences?: string[];
  image?: string;
  practiceCount?: number;
  wrongCount?: number;
  isLearned?: boolean;
}

export interface ImportPhraseTopicRequest {
  topic: string;
  phrases: Array<Omit<CreatePhraseRequest, 'topicId'>>;
}
