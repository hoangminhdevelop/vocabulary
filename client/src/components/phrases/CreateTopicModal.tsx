import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api.service';

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
      name: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.createPhraseTopic(data.name);
      showSuccess('Topic created successfully');
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Topic</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
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
                  disabled={loading}
                  placeholder="Enter topic name"
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

export default CreateTopicModal;
