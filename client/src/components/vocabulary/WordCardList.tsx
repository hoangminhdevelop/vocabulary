import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { VocabularyWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { useDeleteWord } from '../../hooks/useVocabulary';
import EditWordModal from './EditWordModal';

interface WordCardListProps {
  words: VocabularyWord[];
}

const WordCardList: React.FC<WordCardListProps> = ({ words }) => {
  const { showSuccess, setError } = useApp();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<VocabularyWord | null>(null);

  const deleteWordMutation = useDeleteWord();

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

  return (
    <>
      <Grid container spacing={3}>
        {words.map((word) => (
          <Grid item xs={12} sm={6} md={4} key={word._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {word.image && (
                <Box
                  component="img"
                  src={word.image}
                  alt={word.word}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" component="div">
                    {word.word}
                  </Typography>
                  <Chip label={word.type} size="small" color="primary" />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {word.IPA}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {word.definition}
                </Typography>

                {word.exampleSentences && word.exampleSentences.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Examples:
                    </Typography>
                    <Box component="ul" sx={{ mt: 0, pl: 2 }}>
                      {word.exampleSentences.map((sentence, index) => (
                        <Typography
                          component="li"
                          variant="body2"
                          color="text.secondary"
                          key={index}
                          sx={{ mb: 0.5 }}
                        >
                          {sentence}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditClick(word)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(word)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
            Are you sure you want to delete the word "{wordToDelete?.word}"? This action cannot be
            undone.
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

export default WordCardList;
