import React, { useState } from 'react';
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

interface CreatePhraseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topicId: string;
}

interface FormData {
  phrase: string;
  definition: string;
  exampleSentences: { value: string }[];
  image?: string;
}

const schema = yup.object().shape({
  phrase: yup
    .string()
    .required('Phrase is required')
    .min(1, 'Phrase must be at least 1 character')
    .max(200, 'Phrase must not exceed 200 characters'),
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

const CreatePhraseModal: React.FC<CreatePhraseModalProps> = ({
  open,
  onClose,
  onSuccess,
  topicId,
}) => {
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
      phrase: '',
      definition: '',
      exampleSentences: [{ value: '' }],
      image: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exampleSentences',
  });

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

      const phraseData = {
        topicId,
        phrase: data.phrase,
        definition: data.definition,
        exampleSentences,
        ...(data.image && { image: data.image }),
      };

      await apiService.createPhrase(phraseData);
      showSuccess('Phrase created successfully');
      reset();
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
      <DialogTitle>Create New Phrase</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="phrase"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phrase"
                  fullWidth
                  autoFocus
                  error={!!errors.phrase}
                  helperText={errors.phrase?.message}
                  disabled={loading}
                  placeholder="Enter phrase"
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
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePhraseModal;
