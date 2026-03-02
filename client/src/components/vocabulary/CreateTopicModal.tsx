import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../../context/AppContext';
import { useCreateVocabularyTopic } from '../../hooks/useVocabulary';

interface CreateTopicModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Topic name is required')
    .min(2, 'Topic name must be at least 2 characters')
    .max(100, 'Topic name must not exceed 100 characters'),
});

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ open, onClose, onSuccess }) => {
  const { showSuccess } = useApp();
  const createTopicMutation = useCreateVocabularyTopic();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const handleClose = () => {
    reset();
    createTopicMutation.reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    createTopicMutation.mutate(data.name, {
      onSuccess: () => {
        showSuccess('Topic created successfully');
        reset();
        onSuccess();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Topic</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {createTopicMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createTopicMutation.error instanceof Error
                ? createTopicMutation.error.message
                : 'Failed to create topic'}
            </Alert>
          )}
          <Box sx={{ pt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Topic Name"
                  fullWidth
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={createTopicMutation.isPending}
                  placeholder="Enter topic name"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createTopicMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={createTopicMutation.isPending}>
            {createTopicMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTopicModal;
