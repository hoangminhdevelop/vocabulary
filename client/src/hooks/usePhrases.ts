import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { QueryParams } from '../services/api.service';
import {
  CreatePhraseRequest,
  UpdatePhraseRequest,
  ImportPhraseTopicRequest,
} from '../types/api.types';

// Query keys
export const phraseKeys = {
  all: ['phrases'] as const,
  topics: (params?: QueryParams) => [...phraseKeys.all, 'topics', params] as const,
  topic: (id: string) => [...phraseKeys.all, 'topic', id] as const,
  phrases: (topicId: string, params?: QueryParams) =>
    [...phraseKeys.all, 'phrases', topicId, params] as const,
  phrase: (id: string) => [...phraseKeys.all, 'phrase', id] as const,
};

// Fetch all phrase topics
export const usePhraseTopics = (params?: QueryParams) => {
  return useQuery({
    queryKey: phraseKeys.topics(params),
    queryFn: () => apiService.getPhraseTopics(params),
  });
};

// Fetch single phrase topic
export const usePhraseTopic = (topicId: string) => {
  return useQuery({
    queryKey: phraseKeys.topic(topicId),
    queryFn: () => apiService.getPhraseTopicById(topicId),
    enabled: !!topicId,
  });
};

// Fetch phrases by topic
export const usePhrasesByTopic = (topicId: string, params?: QueryParams) => {
  return useQuery({
    queryKey: phraseKeys.phrases(topicId, params),
    queryFn: () => apiService.getPhrases(topicId, params),
    enabled: !!topicId,
  });
};

// Create phrase topic
export const useCreatePhraseTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => apiService.createPhraseTopic(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
    },
  });
};

// Update phrase topic
export const useUpdatePhraseTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, name }: { topicId: string; name: string }) =>
      apiService.updatePhraseTopic(topicId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
      queryClient.invalidateQueries({ queryKey: phraseKeys.topic(variables.topicId) });
    },
  });
};

// Delete phrase topic
export const useDeletePhraseTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => apiService.deletePhraseTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
    },
  });
};

// Create phrase
export const useCreatePhrase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePhraseRequest) => apiService.createPhrase(data),
    onSuccess: (_, variables) => {
      // Invalidate all phrase queries for this topic (regardless of params)
      queryClient.invalidateQueries({
        queryKey: ['phrases', 'phrases', variables.topicId],
      });
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
    },
  });
};

// Update phrase
export const useUpdatePhrase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phraseId, data }: { phraseId: string; data: UpdatePhraseRequest }) =>
      apiService.updatePhrase(phraseId, data),
    onSuccess: (result) => {
      // Invalidate all phrase queries for this topic (regardless of params)
      queryClient.invalidateQueries({
        queryKey: ['phrases', 'phrases', result.topicId],
      });
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
    },
  });
};

// Delete phrase
export const useDeletePhrase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phraseId, topicId }: { phraseId: string; topicId: string }) =>
      apiService.deletePhrase(phraseId).then(() => topicId),
    onSuccess: (topicId) => {
      // Invalidate all phrase queries for this topic (regardless of params)
      queryClient.invalidateQueries({
        queryKey: ['phrases', 'phrases', topicId],
      });
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
    },
  });
};

// Import topic with phrases
export const useImportPhraseTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportPhraseTopicRequest) => apiService.importPhraseTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phraseKeys.topics() });
    },
  });
};
