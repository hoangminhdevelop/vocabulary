import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api.service';

// Query keys for cache management
export const practiceKeys = {
  randomWords: (topicId: string, limit: number) => ['practice', 'words', topicId, limit] as const,
  randomPhrases: (topicId: string, limit: number) =>
    ['practice', 'phrases', topicId, limit] as const,
};

// Hook to fetch random words for practice
export const useRandomWords = (topicId: string, limit: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: practiceKeys.randomWords(topicId, limit),
    queryFn: () => apiService.getRandomWords(topicId, limit),
    enabled: enabled && !!topicId,
    staleTime: 0, // Always fetch fresh data for practice sessions
    gcTime: 0, // Don't cache practice data
  });
};

// Hook to fetch random phrases for practice
export const useRandomPhrases = (topicId: string, limit: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: practiceKeys.randomPhrases(topicId, limit),
    queryFn: () => apiService.getRandomPhrases(topicId, limit),
    enabled: enabled && !!topicId,
    staleTime: 0, // Always fetch fresh data for practice sessions
    gcTime: 0, // Don't cache practice data
  });
};

// Hook to increment word practice count
export const useIncrementWordPractice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wordId: string) => apiService.incrementWordPracticeCount(wordId),
    onSuccess: () => {
      // Invalidate vocabulary queries to reflect updated counts
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
    },
  });
};

// Hook to increment word wrong count
export const useIncrementWordWrong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wordId: string) => apiService.incrementWordWrongCount(wordId),
    onSuccess: () => {
      // Invalidate vocabulary queries to reflect updated counts
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
    },
  });
};

// Hook to increment phrase practice count
export const useIncrementPhrasePractice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phraseId: string) => apiService.incrementPhrasePracticeCount(phraseId),
    onSuccess: () => {
      // Invalidate phrase queries to reflect updated counts
      queryClient.invalidateQueries({ queryKey: ['phrases'] });
    },
  });
};

// Hook to increment phrase wrong count
export const useIncrementPhraseWrong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phraseId: string) => apiService.incrementPhraseWrongCount(phraseId),
    onSuccess: () => {
      // Invalidate phrase queries to reflect updated counts
      queryClient.invalidateQueries({ queryKey: ['phrases'] });
    },
  });
};
