import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
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
import { Phrase } from '../../types';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api.service';
import EditPhraseModal from './EditPhraseModal';

interface PhraseCardListProps {
  phrases: Phrase[];
  onUpdate: () => void;
}

const PhraseCardList: React.FC<PhraseCardListProps> = ({ phrases, onUpdate }) => {
  const { showSuccess, setError } = useApp();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [phraseToDelete, setPhraseToDelete] = useState<Phrase | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    onUpdate();
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

    setDeleting(true);
    try {
      await apiService.deletePhrase(phraseToDelete._id);
      showSuccess('Phrase deleted successfully');
      setDeleteDialogOpen(false);
      setPhraseToDelete(null);
      onUpdate();
    } catch (error) {
      setError(error as string);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {phrases.map((phrase) => (
          <Grid item xs={12} sm={6} md={4} key={phrase._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {phrase.image && (
                <Box
                  component="img"
                  src={phrase.image}
                  alt={phrase.phrase}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {phrase.phrase}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {phrase.definition}
                </Typography>

                {phrase.exampleSentences && phrase.exampleSentences.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Examples:
                    </Typography>
                    <Box component="ul" sx={{ mt: 0, pl: 2 }}>
                      {phrase.exampleSentences.map((sentence, index) => (
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
                  onClick={() => handleEditClick(phrase)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(phrase)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleting} autoFocus>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PhraseCardList;
