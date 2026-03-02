import axios, { AxiosInstance, AxiosError } from 'axios';
import { VocabularyTopic, VocabularyWord, PhraseTopic, Phrase } from '../types';
import {
  ApiResponse,
  CreateVocabularyTopicRequest,
  UpdateVocabularyTopicRequest,
  CreateVocabularyWordRequest,
  UpdateVocabularyWordRequest,
  ImportVocabularyTopicRequest,
  CreatePhraseTopicRequest,
  UpdatePhraseTopicRequest,
  CreatePhraseRequest,
  UpdatePhraseRequest,
  ImportPhraseTopicRequest,
} from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface QueryParams {
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const errorMessage = this.handleError(error);
        return Promise.reject(errorMessage);
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      const data = error.response.data;
      if (data && typeof data === 'object' && 'message' in data) {
        return String(data.message);
      }
      return 'An error occurred';
    } else if (error.request) {
      return 'No response from server';
    } else {
      return error.message || 'An error occurred';
    }
  }

  // Vocabulary Topic APIs
  async getVocabularyTopics(params?: QueryParams): Promise<PaginatedResponse<VocabularyTopic>> {
    const response = await this.api.get<ApiResponse<VocabularyTopic[]> & { pagination: any }>(
      '/vocabulary/topics',
      { params }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        total: response.data.data.length,
        page: 1,
        limit: response.data.data.length,
        totalPages: 1,
      },
    };
  }

  async getVocabularyTopicById(topicId: string): Promise<VocabularyTopic> {
    const response = await this.api.get<ApiResponse<VocabularyTopic>>(
      `/vocabulary/topics/${topicId}`
    );
    return response.data.data;
  }

  async createVocabularyTopic(name: string): Promise<VocabularyTopic> {
    const payload: CreateVocabularyTopicRequest = { name };
    const response = await this.api.post<ApiResponse<VocabularyTopic>>(
      '/vocabulary/topics',
      payload
    );
    return response.data.data;
  }

  async updateVocabularyTopic(topicId: string, name: string): Promise<VocabularyTopic> {
    const payload: UpdateVocabularyTopicRequest = { name };
    const response = await this.api.put<ApiResponse<VocabularyTopic>>(
      `/vocabulary/topics/${topicId}`,
      payload
    );
    return response.data.data;
  }

  async deleteVocabularyTopic(topicId: string): Promise<void> {
    await this.api.delete(`/vocabulary/topics/${topicId}`);
  }

  // Vocabulary Word APIs
  async getVocabularyWords(
    topicId: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<VocabularyWord>> {
    const response = await this.api.get<ApiResponse<VocabularyWord[]> & { pagination: any }>(
      `/vocabulary/topics/${topicId}/words`,
      { params }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        total: response.data.data.length,
        page: 1,
        limit: response.data.data.length,
        totalPages: 1,
      },
    };
  }

  async getVocabularyWordById(wordId: string): Promise<VocabularyWord> {
    const response = await this.api.get<ApiResponse<VocabularyWord>>(`/vocabulary/words/${wordId}`);
    return response.data.data;
  }

  async createVocabularyWord(wordData: CreateVocabularyWordRequest): Promise<VocabularyWord> {
    const response = await this.api.post<ApiResponse<VocabularyWord>>(
      '/vocabulary/words',
      wordData
    );
    return response.data.data;
  }

  async updateVocabularyWord(
    wordId: string,
    wordData: UpdateVocabularyWordRequest
  ): Promise<VocabularyWord> {
    const response = await this.api.put<ApiResponse<VocabularyWord>>(
      `/vocabulary/words/${wordId}`,
      wordData
    );
    return response.data.data;
  }

  async deleteVocabularyWord(wordId: string): Promise<void> {
    await this.api.delete(`/vocabulary/words/${wordId}`);
  }

  async importVocabularyTopic(data: ImportVocabularyTopicRequest): Promise<VocabularyTopic> {
    const response = await this.api.post<ApiResponse<VocabularyTopic>>('/vocabulary/import', data);
    return response.data.data;
  }

  // Phrase Topic APIs
  async getPhraseTopics(params?: QueryParams): Promise<PaginatedResponse<PhraseTopic>> {
    const response = await this.api.get<ApiResponse<PhraseTopic[]> & { pagination: any }>(
      '/phrases/topics',
      { params }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        total: response.data.data.length,
        page: 1,
        limit: response.data.data.length,
        totalPages: 1,
      },
    };
  }

  async getPhraseTopicById(topicId: string): Promise<PhraseTopic> {
    const response = await this.api.get<ApiResponse<PhraseTopic>>(`/phrases/topics/${topicId}`);
    return response.data.data;
  }

  async createPhraseTopic(name: string): Promise<PhraseTopic> {
    const payload: CreatePhraseTopicRequest = { name };
    const response = await this.api.post<ApiResponse<PhraseTopic>>('/phrases/topics', payload);
    return response.data.data;
  }

  async updatePhraseTopic(topicId: string, name: string): Promise<PhraseTopic> {
    const payload: UpdatePhraseTopicRequest = { name };
    const response = await this.api.put<ApiResponse<PhraseTopic>>(
      `/phrases/topics/${topicId}`,
      payload
    );
    return response.data.data;
  }

  async deletePhraseTopic(topicId: string): Promise<void> {
    await this.api.delete(`/phrases/topics/${topicId}`);
  }

  // Phrase APIs
  async getPhrases(topicId: string, params?: QueryParams): Promise<PaginatedResponse<Phrase>> {
    const response = await this.api.get<ApiResponse<Phrase[]> & { pagination: any }>(
      `/phrases/topics/${topicId}/phrases`,
      { params }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        total: response.data.data.length,
        page: 1,
        limit: response.data.data.length,
        totalPages: 1,
      },
    };
  }

  async getPhraseById(phraseId: string): Promise<Phrase> {
    const response = await this.api.get<ApiResponse<Phrase>>(`/phrases/phrases/${phraseId}`);
    return response.data.data;
  }

  async createPhrase(phraseData: CreatePhraseRequest): Promise<Phrase> {
    const response = await this.api.post<ApiResponse<Phrase>>('/phrases/phrases', phraseData);
    return response.data.data;
  }

  async updatePhrase(phraseId: string, phraseData: UpdatePhraseRequest): Promise<Phrase> {
    const response = await this.api.put<ApiResponse<Phrase>>(
      `/phrases/phrases/${phraseId}`,
      phraseData
    );
    return response.data.data;
  }

  async deletePhrase(phraseId: string): Promise<void> {
    await this.api.delete(`/phrases/phrases/${phraseId}`);
  }

  async importPhraseTopic(data: ImportPhraseTopicRequest): Promise<PhraseTopic> {
    const response = await this.api.post<ApiResponse<PhraseTopic>>('/phrases/import', data);
    return response.data.data;
  }

  // Practice APIs
  async getRandomWords(topicId: string, limit: number = 20): Promise<VocabularyWord[]> {
    const response = await this.api.get<ApiResponse<VocabularyWord[]>>(
      `/vocabulary/topics/${topicId}/words/random`,
      { params: { limit } }
    );
    return response.data.data;
  }

  async getRandomPhrases(topicId: string, limit: number = 20): Promise<Phrase[]> {
    const response = await this.api.get<ApiResponse<Phrase[]>>(
      `/phrases/topics/${topicId}/phrases/random`,
      { params: { limit } }
    );
    return response.data.data;
  }

  async incrementWordPracticeCount(wordId: string): Promise<VocabularyWord> {
    const response = await this.api.patch<ApiResponse<VocabularyWord>>(
      `/vocabulary/words/${wordId}/practice`
    );
    return response.data.data;
  }

  async incrementWordWrongCount(wordId: string): Promise<VocabularyWord> {
    const response = await this.api.patch<ApiResponse<VocabularyWord>>(
      `/vocabulary/words/${wordId}/wrong`
    );
    return response.data.data;
  }

  async incrementPhrasePracticeCount(phraseId: string): Promise<Phrase> {
    const response = await this.api.patch<ApiResponse<Phrase>>(
      `/phrases/phrases/${phraseId}/practice`
    );
    return response.data.data;
  }

  async incrementPhraseWrongCount(phraseId: string): Promise<Phrase> {
    const response = await this.api.patch<ApiResponse<Phrase>>(
      `/phrases/phrases/${phraseId}/wrong`
    );
    return response.data.data;
  }
}

export default new ApiService();
