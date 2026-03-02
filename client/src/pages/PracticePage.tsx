import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Cancel, Home, ArrowBack } from '@mui/icons-material';
import { VocabularyWord, Phrase } from '../types';
import {
  useRandomWords,
  useRandomPhrases,
  useIncrementWordPractice,
  useIncrementWordWrong,
  useIncrementPhrasePractice,
  useIncrementPhraseWrong,
} from '../hooks/usePractice';

type PracticeItem = VocabularyWord | Phrase;
type PracticeType = 'vocabulary' | 'phrase';

interface PracticeState {
  items: PracticeItem[];
  currentIndex: number;
  userAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  sessionComplete: boolean;
  correctCount: number;
  wrongCount: number;
  wrongItems: PracticeItem[];
  requireRetype: boolean;
}

const PracticePage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const practiceType: PracticeType = location.pathname.includes('/vocabulary')
    ? 'vocabulary'
    : 'phrase';

  const [limit, setLimit] = useState(20);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [practiceState, setPracticeState] = useState<PracticeState>({
    items: [],
    currentIndex: 0,
    userAnswer: '',
    showResult: false,
    isCorrect: false,
    correctAnswer: '',
    sessionComplete: false,
    correctCount: 0,
    wrongCount: 0,
    wrongItems: [],
    requireRetype: false,
  });

  // React Query hooks
  const {
    data: randomWords,
    isLoading: loadingWords,
    error: wordsError,
    refetch: refetchWords,
  } = useRandomWords(
    topicId || '',
    limit,
    false // Don't fetch automatically
  );

  const {
    data: randomPhrases,
    isLoading: loadingPhrases,
    error: phrasesError,
    refetch: refetchPhrases,
  } = useRandomPhrases(
    topicId || '',
    limit,
    false // Don't fetch automatically
  );

  const incrementWordPractice = useIncrementWordPractice();
  const incrementWordWrong = useIncrementWordWrong();
  const incrementPhrasePractice = useIncrementPhrasePractice();
  const incrementPhraseWrong = useIncrementPhraseWrong();

  const loading = loadingWords || loadingPhrases;
  const error = wordsError || phrasesError;

  // Handle data loading after refetch
  useEffect(() => {
    if (practiceType === 'vocabulary' && randomWords) {
      if (randomWords.length === 0) {
        // Don't start session if no items
        return;
      }
      setPracticeState({
        items: randomWords,
        currentIndex: 0,
        userAnswer: '',
        showResult: false,
        isCorrect: false,
        correctAnswer: '',
        sessionComplete: false,
        correctCount: 0,
        wrongCount: 0,
        wrongItems: [],
        requireRetype: false,
      });
      setSessionStarted(true);
    } else if (practiceType === 'phrase' && randomPhrases) {
      if (randomPhrases.length === 0) {
        // Don't start session if no items
        return;
      }
      setPracticeState({
        items: randomPhrases,
        currentIndex: 0,
        userAnswer: '',
        showResult: false,
        isCorrect: false,
        correctAnswer: '',
        sessionComplete: false,
        correctCount: 0,
        wrongCount: 0,
        wrongItems: [],
        requireRetype: false,
      });
      setSessionStarted(true);
    }
  }, [randomWords, randomPhrases, practiceType]);

  const startSession = async () => {
    if (!topicId) return;

    try {
      if (practiceType === 'vocabulary') {
        await refetchWords();
      } else {
        await refetchPhrases();
      }
    } catch (err) {
      console.error('Failed to load practice items:', err);
    }
  };

  const currentItem = practiceState.items[practiceState.currentIndex];

  const isWord = (item: PracticeItem): item is VocabularyWord => {
    return 'word' in item;
  };

  const getItemText = (item: PracticeItem): string => {
    return isWord(item) ? item.word : item.phrase;
  };

  const checkAnswer = async () => {
    if (!currentItem || practiceState.requireRetype) return;

    const correctAnswer = getItemText(currentItem);
    const isCorrect = practiceState.userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    try {
      if (isCorrect) {
        // Increment practice count using mutations
        if (practiceType === 'vocabulary') {
          incrementWordPractice.mutate(currentItem._id);
        } else {
          incrementPhrasePractice.mutate(currentItem._id);
        }

        // Move to next word immediately
        setPracticeState((prev) => {
          const nextIndex = prev.currentIndex + 1;
          if (nextIndex >= prev.items.length) {
            return {
              ...prev,
              correctCount: prev.correctCount + 1,
              sessionComplete: true,
            };
          } else {
            return {
              ...prev,
              correctCount: prev.correctCount + 1,
              currentIndex: nextIndex,
              userAnswer: '',
              showResult: false,
              isCorrect: false,
              correctAnswer: '',
              requireRetype: false,
            };
          }
        });
      } else {
        // Increment wrong count using mutations
        if (practiceType === 'vocabulary') {
          incrementWordWrong.mutate(currentItem._id);
        } else {
          incrementPhraseWrong.mutate(currentItem._id);
        }

        setPracticeState((prev) => ({
          ...prev,
          showResult: true,
          isCorrect,
          correctAnswer,
          wrongCount: prev.wrongCount + 1,
          wrongItems: [...prev.wrongItems, currentItem],
          requireRetype: true,
        }));
      }
    } catch (err) {
      console.error('Failed to update practice count:', err);
    }
  };

  const handleNext = () => {
    if (practiceState.requireRetype) {
      const correctAnswer = getItemText(currentItem);
      if (practiceState.userAnswer.trim().toLowerCase() !== correctAnswer.toLowerCase()) {
        return; // Don't proceed if user hasn't retyped correctly
      }
    }

    const nextIndex = practiceState.currentIndex + 1;
    if (nextIndex >= practiceState.items.length) {
      setPracticeState((prev) => ({
        ...prev,
        sessionComplete: true,
      }));
    } else {
      setPracticeState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        userAnswer: '',
        showResult: false,
        isCorrect: false,
        correctAnswer: '',
        requireRetype: false,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!practiceState.showResult) {
        checkAnswer();
      } else {
        handleNext();
      }
    }
  };

  const getAccuracy = () => {
    const total = practiceState.correctCount + practiceState.wrongCount;
    if (total === 0) return 0;
    return Math.round((practiceState.correctCount / total) * 100);
  };

  // Session start screen
  if (!sessionStarted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Practice Session
          </Typography>
          <Typography variant="body1" paragraph align="center" color="text.secondary">
            Choose how many {practiceType === 'vocabulary' ? 'words' : 'phrases'} you want to
            practice:
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Number of items"
            value={limit}
            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: 100 }}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error instanceof Error ? error.message : 'Failed to load practice items'}
            </Alert>
          )}

          {randomWords && randomWords.length === 0 && practiceType === 'vocabulary' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No words found in this topic
            </Alert>
          )}

          {randomPhrases && randomPhrases.length === 0 && practiceType === 'phrase' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No phrases found in this topic
            </Alert>
          )}

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button variant="contained" onClick={startSession} disabled={loading} size="large">
              {loading ? <CircularProgress size={24} /> : 'Start Practice'}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Congratulations screen
  if (practiceState.sessionComplete) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom color="primary">
            🎉 Congratulations! 🎉
          </Typography>
          <Typography variant="h5" gutterBottom>
            Session Complete
          </Typography>

          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Your Results
            </Typography>
            <Box display="flex" justifyContent="center" gap={4} sx={{ my: 3 }}>
              <Box>
                <Typography variant="h4" color="success.main">
                  {practiceState.correctCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="error.main">
                  {practiceState.wrongCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wrong
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="primary.main">
                  {getAccuracy()}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
            </Box>

            {practiceState.wrongItems.length > 0 && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom color="error.main">
                  Items to Review:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {practiceState.wrongItems.map((item, index) => (
                    <Card key={index} variant="outlined" sx={{ borderColor: 'error.light' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {practiceType === 'vocabulary'
                            ? (item as VocabularyWord).word
                            : (item as Phrase).phrase}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.definition}
                        </Typography>
                        {practiceType === 'vocabulary' && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={(item as VocabularyWord).type}
                              size="small"
                              color="primary"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary" component="span">
                              {(item as VocabularyWord).IPA}
                            </Typography>
                          </Box>
                        )}
                        {item.exampleSentences && item.exampleSentences.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Example: {item.exampleSentences[0]}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/${practiceType}/${topicId}`)}
            >
              Back to Topic
            </Button>
            <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/')}>
              Go Home
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Practice screen
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Progress indicator */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Progress: {practiceState.currentIndex + 1} / {practiceState.items.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Accuracy: {getAccuracy()}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={((practiceState.currentIndex + 1) / practiceState.items.length) * 100}
        />
      </Box>

      {/* Practice card */}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {currentItem && (
            <>
              {/* Learned badge */}
              {currentItem.isLearned && (
                <Chip label="Learned" color="success" size="small" sx={{ mb: 2 }} />
              )}

              {/* Definition */}
              <Typography variant="h6" gutterBottom color="text.secondary">
                Definition:
              </Typography>
              <Typography variant="h5" paragraph>
                {currentItem.definition}
              </Typography>

              {/* Answer input */}
              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  label={
                    practiceState.requireRetype
                      ? 'Retype the correct answer'
                      : `Enter the ${practiceType === 'vocabulary' ? 'word' : 'phrase'}`
                  }
                  value={practiceState.userAnswer}
                  onChange={(e) =>
                    setPracticeState((prev) => ({
                      ...prev,
                      userAnswer: e.target.value,
                    }))
                  }
                  onKeyPress={handleKeyPress}
                  disabled={practiceState.showResult && !practiceState.requireRetype}
                  error={practiceState.showResult && !practiceState.isCorrect}
                  helperText={
                    practiceState.showResult && !practiceState.isCorrect
                      ? `Correct answer: ${practiceState.correctAnswer}`
                      : practiceState.requireRetype
                        ? 'Please retype the correct answer to continue'
                        : ''
                  }
                  autoFocus
                />
              </Box>

              {/* Result indicator */}
              {!practiceState.isCorrect && practiceState.showResult && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 1,
                    borderColor: 'error.main',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <>
                    <Cancel color="error" />
                    <Typography color="error.main">
                      Wrong. Please retype the correct answer.
                    </Typography>
                  </>
                </Box>
              )}

              {/* Action buttons */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {!practiceState.showResult ? (
                  <Button
                    variant="contained"
                    onClick={checkAnswer}
                    disabled={!practiceState.userAnswer.trim()}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      practiceState.requireRetype &&
                      practiceState.userAnswer.trim().toLowerCase() !==
                        practiceState.correctAnswer.toLowerCase()
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PracticePage;
