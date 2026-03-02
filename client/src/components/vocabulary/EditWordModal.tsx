import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api.service';
import { VocabularyWord } from '../../types';

interface EditWordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  word: VocabularyWord;
}

interface FormData {
  word: string;
  type: string;
  IPA: string;
  definition: string;
  exampleSentences: { value: string }[];
  image?: string;
}

const schema = yup.object().shape({
  word: yup
    .string()
    .required('Word is required')
    .min(1, 'Word must be at least 1 character')
    .max(100, 'Word must not exceed 100 characters'),
  type: yup.string().required('Type is required').max(50, 'Type must not exceed 50 characters'),
  IPA: yup.string().required('IPA is required').max(100, 'IPA must not exceed 100 characters'),
  definition: yup
    .string()
    .required('Definition is required')
    .min(1, 'Definition must be at least 1 character')
    .max(500, 'Definition must not exceed 500 characters'),
  exampleSentences: yup.array().of(
    yup.object().shape({
      value: yup.string(),
    })
  ),
  image: yup.string().max(500, 'Image URL must not exceed 500 characters'),
});

const EditWordModal: React.FC<EditWordModalProps> = ({ open, onClose, onSuccess, word }) => {
  const [loading, setLoading] = useState(false);
  const { setError, showSuccess } = useApp();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      word: '',
      type: '',
      IPA: '',
      definition: '',
      exampleSentences: [{ value: '' }],
      image: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exampleSentences',
  });

  // Reset form with word data when word or open changes
  useEffect(() => {
    if (open && word) {
      const exampleSentences =
        word.exampleSentences.length > 0
          ? word.exampleSentences.map((sentence) => ({ value: sentence }))
          : [{ value: '' }];

      reset({
        word: word.word,
        type: word.type,
        IPA: word.IPA,
        definition: word.definition,
        exampleSentences,
        image: word.image || '',
      });
    }
  }, [open, word, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      // Transform exampleSentences from array of objects to array of strings
      // Filter out empty sentences
      const exampleSentences = data.exampleSentences
        .map((item) => item.value)
        .filter((sentence) => sentence.trim() !== '');

      const wordData = {
        topicId: word.topicId,
        word: data.word,
        type: data.type,
        IPA: data.IPA,
        definition: data.definition,
        exampleSentences,
        ...(data.image && { image: data.image }),
      };

      await apiService.updateVocabularyWord(word._id, wordData);
      showSuccess('Word updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Word</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="word"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Word"
                  fullWidth
                  autoFocus
                  error={!!errors.word}
                  helperText={errors.word?.message}
                  disabled={loading}
                  placeholder="Enter word"
                  required
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Type"
                  fullWidth
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  disabled={loading}
                  placeholder="e.g., noun, verb, adjective"
                  required
                />
              )}
            />

            <Controller
              name="IPA"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="IPA"
                  fullWidth
                  error={!!errors.IPA}
                  helperText={errors.IPA?.message}
                  disabled={loading}
                  placeholder="Enter IPA pronunciation"
                  required
                />
              )}
            />

            <Controller
              name="definition"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Definition"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.definition}
                  helperText={errors.definition?.message}
                  disabled={loading}
                  placeholder="Enter definition"
                  required
                />
              )}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Example Sentences
              </Typography>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <Controller
                    name={`exampleSentences.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="Enter example sentence"
                        disabled={loading}
                        size="small"
                      />
                    )}
                  />
                  <IconButton
                    onClick={() => remove(index)}
                    disabled={loading || fields.length === 1}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => append({ value: '' })}
                disabled={loading}
                variant="outlined"
                size="small"
              >
                Add Example Sentence
              </Button>
            </Box>

            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Image URL (Optional)"
                  fullWidth
                  error={!!errors.image}
                  helperText={errors.image?.message}
                  disabled={loading}
                  placeholder="Enter image URL"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditWordModal;
