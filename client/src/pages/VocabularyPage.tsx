import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableSortLabel,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, Upload, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { useVocabularyTopics, useDeleteVocabularyTopic } from '../hooks/useVocabulary';
import { useDebounce } from '../hooks/useDebounce';
import { VocabularyTopic } from '../types';
import { useApp } from '../context/AppContext';
import CreateTopicModal from '../components/vocabulary/CreateTopicModal';
import ImportTopicModal from '../components/vocabulary/ImportTopicModal';

const VocabularyPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, setError } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<VocabularyTopic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<'name' | 'wordCount' | 'updatedAt'>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Debounce search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use React Query hook for data fetching with server-side features
  const {
    data: topicsResponse,
    isLoading,
    error,
  } = useVocabularyTopics({
    search: debouncedSearchTerm,
    sortBy: orderBy,
    order,
    page: page + 1, // Backend uses 1-based pagination
    limit: rowsPerPage,
  });
  const deleteTopicMutation = useDeleteVocabularyTopic();

  const handleTopicClick = (topicId: string) => {
    navigate(`/vocabulary/${topicId}`);
  };

  const topics = topicsResponse?.data || [];
  const pagination = topicsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: rowsPerPage,
    totalPages: 0,
  };

  const handleSort = (column: 'name' | 'wordCount' | 'updatedAt') => {
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

  const handleDeleteClick = (e: React.MouseEvent, topic: VocabularyTopic) => {
    e.stopPropagation();
    setTopicToDelete(topic);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTopicToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;

    try {
      await deleteTopicMutation.mutateAsync(topicToDelete._id);
      showSuccess('Topic deleted successfully');
      setDeleteDialogOpen(false);
      setTopicToDelete(null);
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Vocabulary Topics
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select a topic to start learning vocabulary words
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)}>
          Create New Topic
        </Button>
        <Button variant="outlined" startIcon={<Upload />} onClick={() => setImportModalOpen(true)}>
          Import Topics
        </Button>
      </Box>

      {!isLoading && topics.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search topics by name..."
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
          {error instanceof Error ? error.message : 'An error occurred'}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : topics.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No topics found' : 'No topics yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create a new topic or import topics from a JSON file to get started'}
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      <strong>Topic Name</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'wordCount'}
                      direction={orderBy === 'wordCount' ? order : 'asc'}
                      onClick={() => handleSort('wordCount')}
                    >
                      <strong>Word Count</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'updatedAt'}
                      direction={orderBy === 'updatedAt' ? order : 'asc'}
                      onClick={() => handleSort('updatedAt')}
                    >
                      <strong>Last Updated</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow
                    key={topic._id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleTopicClick(topic._id)}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight={500}>
                        {topic.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {topic.wordCount} {topic.wordCount === 1 ? 'word' : 'words'}
                    </TableCell>
                    <TableCell>{new Date(topic.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleDeleteClick(e, topic)}
                        aria-label="delete topic"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

      <CreateTopicModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <ImportTopicModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the topic "{topicToDelete?.name}"?
            <br />
            <strong>
              This will also delete all {topicToDelete?.wordCount || 0} words in this topic.
            </strong>
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteTopicMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteTopicMutation.isPending}
            autoFocus
          >
            {deleteTopicMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VocabularyPage;
