import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  TableSortLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { VocabularyWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { useDeleteWord, useUpdateWord } from '../../hooks/useVocabulary';
import EditWordModal from './EditWordModal';
import ImageWithModal from '../ImageWithModal';
import SpeakButton from '../SpeakButton';

interface WordTableProps {
  words: VocabularyWord[];
  onUpdate?: () => void;
  orderBy?: 'word' | 'type' | 'practiceCount' | 'wrongCount' | 'isLearned';
  order?: 'asc' | 'desc';
  onSort?: (column: 'word' | 'type' | 'practiceCount' | 'wrongCount' | 'isLearned') => void;
}

const WordTable: React.FC<WordTableProps> = ({ words, onUpdate, orderBy, order, onSort }) => {
  const { showSuccess, setError } = useApp();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<VocabularyWord | null>(null);

  const deleteWordMutation = useDeleteWord();
  const updateWordMutation = useUpdateWord();

  const handleEditClick = (word: VocabularyWord) => {
    setSelectedWord(word);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedWord(null);
  };

  const handleEditSuccess = () => {
    handleEditClose();
    onUpdate?.();
  };

  const handleDeleteClick = (word: VocabularyWord) => {
    setWordToDelete(word);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setWordToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!wordToDelete) return;

    try {
      await deleteWordMutation.mutateAsync({
        wordId: wordToDelete._id,
        topicId: wordToDelete.topicId,
      });
      showSuccess('Word deleted successfully');
      setDeleteDialogOpen(false);
      setWordToDelete(null);
    } catch (error) {
      setError(error as string);
    }
  };

  const handleLearnedToggle = async (word: VocabularyWord) => {
    try {
      await updateWordMutation.mutateAsync({
        wordId: word._id,
        data: { isLearned: !word.isLearned },
      });
      showSuccess(`Word marked as ${!word.isLearned ? 'learned' : 'not learned'}`);
    } catch (error) {
      setError(error as string);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {onSort ? (
                  <TableSortLabel
                    active={orderBy === 'word'}
                    direction={orderBy === 'word' ? order : 'asc'}
                    onClick={() => onSort('word')}
                  >
                    <strong>Word</strong>
                  </TableSortLabel>
                ) : (
                  <strong>Word</strong>
                )}
              </TableCell>
              <TableCell align="center">
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                {onSort ? (
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => onSort('type')}
                  >
                    <strong>Type</strong>
                  </TableSortLabel>
                ) : (
                  <strong>Type</strong>
                )}
              </TableCell>
              <TableCell sx={{ minWidth: 120 }}>
                <strong>IPA</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <strong>Definition</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Example Sentences</strong>
              </TableCell>
              <TableCell align="center">
                {onSort ? (
                  <TableSortLabel
                    active={orderBy === 'practiceCount'}
                    direction={orderBy === 'practiceCount' ? order : 'asc'}
                    onClick={() => onSort('practiceCount')}
                  >
                    <strong>Practice Times</strong>
                  </TableSortLabel>
                ) : (
                  <strong>Practice Times</strong>
                )}
              </TableCell>
              <TableCell align="center">
                {onSort ? (
                  <TableSortLabel
                    active={orderBy === 'wrongCount'}
                    direction={orderBy === 'wrongCount' ? order : 'asc'}
                    onClick={() => onSort('wrongCount')}
                  >
                    <strong>Wrong Times</strong>
                  </TableSortLabel>
                ) : (
                  <strong>Wrong Times</strong>
                )}
              </TableCell>
              <TableCell align="center">
                {onSort ? (
                  <TableSortLabel
                    active={orderBy === 'isLearned'}
                    direction={orderBy === 'isLearned' ? order : 'asc'}
                    onClick={() => onSort('isLearned')}
                  >
                    <strong>Learned</strong>
                  </TableSortLabel>
                ) : (
                  <strong>Learned</strong>
                )}
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No words found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              words.map((word) => (
                <TableRow key={word._id} hover>
                  <TableCell>
                    <Typography textTransform="capitalize" variant="body1" fontWeight="medium">
                      {word.word}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <ImageWithModal src={word.image} alt={word.word} size={60} />
                  </TableCell>
                  <TableCell>
                    <Chip label={word.type} size="small" color="primary" />
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {word.IPA}
                      </Typography>
                      <SpeakButton text={word.word} size="small" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Typography variant="body2">{word.definition}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={word.exampleSentences?.length || 0}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{word.practiceCount || 0}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{word.wrongCount || 0}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={word.isLearned || false}
                      onChange={() => handleLearnedToggle(word)}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(word)}
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(word)}
                        aria-label="delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Word Modal */}
      {selectedWord && (
        <EditWordModal
          open={editModalOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          word={selectedWord}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the word <strong>{wordToDelete?.word}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteWordMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteWordMutation.isPending}
            autoFocus
          >
            {deleteWordMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WordTable;
