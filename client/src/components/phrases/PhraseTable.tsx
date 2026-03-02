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
import { Phrase } from '../../types';
import { useApp } from '../../context/AppContext';
import { useUpdatePhrase, useDeletePhrase } from '../../hooks/usePhrases';
import EditPhraseModal from './EditPhraseModal';

interface PhraseTableProps {
  phrases: Phrase[];
  onUpdate?: () => void;
  orderBy?: 'phrase' | 'practiceCount' | 'wrongCount' | 'isLearned';
  order?: 'asc' | 'desc';
  onSort?: (column: 'phrase' | 'practiceCount' | 'wrongCount' | 'isLearned') => void;
}

const PhraseTable: React.FC<PhraseTableProps> = ({ phrases, onUpdate, orderBy, order, onSort }) => {
  const { showSuccess, setError } = useApp();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [phraseToDelete, setPhraseToDelete] = useState<Phrase | null>(null);

  const updatePhraseMutation = useUpdatePhrase();
  const deletePhraseMutation = useDeletePhrase();

  const handleEditClick = (phrase: Phrase) => {
    setSelectedPhrase(phrase);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedPhrase(null);
  };

  const handleEditSuccess = () => {
    handleEditClose();
    onUpdate?.();
  };

  const handleDeleteClick = (phrase: Phrase) => {
    setPhraseToDelete(phrase);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPhraseToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!phraseToDelete) return;

    try {
      await deletePhraseMutation.mutateAsync({
        phraseId: phraseToDelete._id,
        topicId: phraseToDelete.topicId,
      });
      showSuccess('Phrase deleted successfully');
      setDeleteDialogOpen(false);
      setPhraseToDelete(null);
      onUpdate?.();
    } catch (error) {
      setError(error as string);
    }
  };

  const handleLearnedToggle = async (phrase: Phrase) => {
    try {
      await updatePhraseMutation.mutateAsync({
        phraseId: phrase._id,
        data: { isLearned: !phrase.isLearned },
      });
      showSuccess(`Phrase marked as ${!phrase.isLearned ? 'learned' : 'not learned'}`);
      onUpdate?.();
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
                    active={orderBy === 'phrase'}
                    direction={orderBy === 'phrase' ? order : 'asc'}
                    onClick={() => onSort('phrase')}
                  >
                    <strong>Phrase</strong>
                  </TableSortLabel>
                ) : (
                  <strong>Phrase</strong>
                )}
              </TableCell>
              <TableCell>
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
            {phrases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No phrases found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              phrases.map((phrase) => (
                <TableRow key={phrase._id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {phrase.phrase}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{phrase.definition}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={phrase.exampleSentences?.length || 0}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{phrase.practiceCount || 0}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{phrase.wrongCount || 0}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={phrase.isLearned || false}
                      onChange={() => handleLearnedToggle(phrase)}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(phrase)}
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(phrase)}
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

      {/* Edit Phrase Modal */}
      {selectedPhrase && (
        <EditPhraseModal
          open={editModalOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          phrase={selectedPhrase}
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
            Are you sure you want to delete the phrase "{phraseToDelete?.phrase}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deletePhraseMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deletePhraseMutation.isPending}
            autoFocus
          >
            {deletePhraseMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PhraseTable;
