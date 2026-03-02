import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { QueryParams } from '../services/api.service';
import {
  CreateVocabularyWordRequest,
  UpdateVocabularyWordRequest,
  ImportVocabularyTopicRequest,
} from '../types/api.types';

// Query keys
export const vocabularyKeys = {
  all: ['vocabulary'] as const,
  topics: (params?: QueryParams) => [...vocabularyKeys.all, 'topics', params] as const,
  topic: (id: string) => [...vocabularyKeys.all, 'topic', id] as const,
  words: (topicId: string, params?: QueryParams) =>
    [...vocabularyKeys.all, 'words', topicId, params] as const,
  word: (id: string) => [...vocabularyKeys.all, 'word', id] as const,
};

// Fetch all vocabulary topics
export const useVocabularyTopics = (params?: QueryParams) => {
  return useQuery({
    queryKey: vocabularyKeys.topics(params),
    queryFn: () => apiService.getVocabularyTopics(params),
  });
};

// Fetch single vocabulary topic
export const useVocabularyTopic = (topicId: string) => {
  return useQuery({
    queryKey: vocabularyKeys.topic(topicId),
    queryFn: () => apiService.getVocabularyTopicById(topicId),
    enabled: !!topicId,
  });
};

// Fetch words by topic
export const useVocabularyWords = (topicId: string, params?: QueryParams) => {
  return useQuery({
    queryKey: vocabularyKeys.words(topicId, params),
    queryFn: () => apiService.getVocabularyWords(topicId, params),
    enabled: !!topicId,
  });
};

// Create vocabulary topic
export const useCreateVocabularyTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => apiService.createVocabularyTopic(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
    },
  });
};

// Update vocabulary topic
export const useUpdateVocabularyTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, name }: { topicId: string; name: string }) =>
      apiService.updateVocabularyTopic(topicId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topic(variables.topicId) });
    },
  });
};

// Delete vocabulary topic
export const useDeleteVocabularyTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => apiService.deleteVocabularyTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
    },
  });
};

// Create word
export const useCreateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVocabularyWordRequest) => apiService.createVocabularyWord(data),
    onSuccess: (_, variables) => {
      // Invalidate all word queries for this topic (regardless of params)
      queryClient.invalidateQueries({
        queryKey: ['vocabulary', 'words', variables.topicId],
      });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
    },
  });
};

// Update word
export const useUpdateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId, data }: { wordId: string; data: UpdateVocabularyWordRequest }) =>
      apiService.updateVocabularyWord(wordId, data),
    onSuccess: (updatedWord) => {
      // Update the cache directly instead of invalidating
      queryClient.setQueriesData(
        { queryKey: ['vocabulary', 'words', updatedWord.topicId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((word: any) =>
              word._id === updatedWord._id ? updatedWord : word
            ),
          };
        }
      );
      // Only invalidate topics if it might affect counts
      if (updatedWord.isLearned !== undefined) {
        queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
      }
    },
  });
};

// Delete word
export const useDeleteWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId, topicId }: { wordId: string; topicId: string }) =>
      apiService.deleteVocabularyWord(wordId),
    onSuccess: (_, variables) => {
      // Invalidate all word queries for this topic (regardless of params)
      queryClient.invalidateQueries({
        queryKey: ['vocabulary', 'words', variables.topicId],
      });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
    },
  });
};

// Import topic with words
export const useImportVocabularyTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportVocabularyTopicRequest) => apiService.importVocabularyTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.topics() });
    },
  });
};
