import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  TablePagination,
  Paper,
} from '@mui/material';
import { Add, Search as SearchIcon, Psychology, Upload } from '@mui/icons-material';
import { useVocabularyTopic, useVocabularyWords } from '../hooks/useVocabulary';
import { useDebounce } from '../hooks/useDebounce';
import WordTable from '../components/vocabulary/WordTable';
import CreateWordModal from '../components/vocabulary/CreateWordModal';
import ImportWordsModal from '../components/vocabulary/ImportWordsModal';

const VocabularyDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<
    'word' | 'type' | 'practiceCount' | 'wrongCount' | 'isLearned'
  >('word');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Debounce search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch topic and words using React Query
  const {
    data: topic,
    isLoading: isTopicLoading,
    error: topicError,
  } = useVocabularyTopic(topicId || '');

  const {
    data: wordsResponse,
    isLoading: isWordsLoading,
    error: wordsError,
    refetch: refetchWords,
  } = useVocabularyWords(topicId || '', {
    search: debouncedSearchTerm,
    sortBy: orderBy,
    order,
    page: page + 1,
    limit: rowsPerPage,
  });

  const words = wordsResponse?.data || [];
  const pagination = wordsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: rowsPerPage,
    totalPages: 0,
  };

  const isLoading = isTopicLoading || isWordsLoading;
  const error = topicError || wordsError;

  const handleSort = (column: 'word' | 'type' | 'practiceCount' | 'wrongCount' | 'isLearned') => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
    setPage(0); // Reset to first page when sorting
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
  };

  const handleImportSuccess = () => {
    setImportModalOpen(false);
  };

  if (isLoading && !topic) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !topic) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          {String(error)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {topic?.name || 'Loading...'}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {pagination.total} {pagination.total === 1 ? 'word' : 'words'}
          {searchTerm && ` (filtered from total)`}
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)}>
          Create New Word
        </Button>
        <Button variant="outlined" startIcon={<Upload />} onClick={() => setImportModalOpen(true)}>
          Import Words
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Psychology />}
          onClick={() => navigate(`/vocabulary/${topicId}/practice`)}
        >
          Practice
        </Button>
      </Box>

      {words.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by word, definition, or type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {String(error)}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : words.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No words found' : 'No words yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first word to get started'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create New Word
            </Button>
          )}
        </Box>
      ) : (
        <>
          <WordTable
            words={words}
            onUpdate={refetchWords}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
          <Paper sx={{ mt: 2 }}>
            <TablePagination
              component="div"
              count={pagination.total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </Paper>
        </>
      )}

      {topicId && (
        <>
          <CreateWordModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
            topicId={topicId}
          />
          <ImportWordsModal
            open={importModalOpen}
            onClose={() => setImportModalOpen(false)}
            onSuccess={handleImportSuccess}
            topicId={topicId}
          />
        </>
      )}
    </Container>
  );
};

export default VocabularyDetailPage;
