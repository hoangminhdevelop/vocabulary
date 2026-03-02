export interface VocabularyTopic {
  _id: string;
  name: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyWord {
  _id: string;
  topicId: string;
  word: string;
  type: string;
  IPA: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
  practiceCount: number;
  wrongCount: number;
  isLearned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhraseTopic {
  _id: string;
  name: string;
  phraseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Phrase {
  _id: string;
  topicId: string;
  phrase: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
  practiceCount: number;
  wrongCount: number;
  isLearned: boolean;
  createdAt: string;
  updatedAt: string;
}
