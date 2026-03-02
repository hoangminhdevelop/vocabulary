import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useImportPhraseTopic } from '../../hooks/usePhrases';

interface ImportTopicModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportData {
  topic: string;
  phrases: {
    phrase: string;
    definition: string;
    exampleSentences: string[];
    image?: string;
  }[];
}

const ImportTopicModal: React.FC<ImportTopicModalProps> = ({ open, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { showSuccess } = useApp();
  const importMutation = useImportPhraseTopic();

  const handleClose = () => {
    setSelectedFile(null);
    setValidationError(null);
    importMutation.reset();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        setValidationError('Please select a valid JSON file');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setValidationError(null);
    }
  };

  const validateStructure = (data: any): data is ImportData => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    if (!data.topic || typeof data.topic !== 'string') {
      throw new Error('Missing or invalid "topic" field');
    }

    if (!Array.isArray(data.phrases)) {
      throw new Error('Missing or invalid "phrases" field - must be an array');
    }

    if (data.phrases.length === 0) {
      throw new Error('Phrases array cannot be empty');
    }

    for (let i = 0; i < data.phrases.length; i++) {
      const phrase = data.phrases[i];
      if (!phrase.phrase || typeof phrase.phrase !== 'string') {
        throw new Error(`Phrase at index ${i}: missing or invalid "phrase" field`);
      }
      if (!phrase.definition || typeof phrase.definition !== 'string') {
        throw new Error(`Phrase at index ${i}: missing or invalid "definition" field`);
      }
      if (!Array.isArray(phrase.exampleSentences)) {
        throw new Error(`Phrase at index ${i}: "exampleSentences" must be an array`);
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setValidationError('Please select a file');
      return;
    }

    try {
      setValidationError(null);

      const fileContent = await selectedFile.text();
      const data = JSON.parse(fileContent);

      validateStructure(data);

      importMutation.mutate(data, {
        onSuccess: () => {
          showSuccess('Topic imported successfully');
          setSelectedFile(null);
          onSuccess();
          onClose();
        },
        onError: (error) => {
          if (error instanceof Error) {
            setValidationError(error.message);
          }
        },
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        setValidationError('Invalid JSON format');
      } else if (error instanceof Error) {
        setValidationError(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Topic from JSON</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              disabled={importMutation.isPending}
              sx={{ py: 2 }}
            >
              {selectedFile ? selectedFile.name : 'Choose JSON File'}
              <input
                type="file"
                hidden
                accept=".json,application/json"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Expected JSON Structure:
            </Typography>
            <Box
              component="pre"
              sx={{
                fontSize: '0.75rem',
                overflow: 'auto',
                m: 0,
                fontFamily: 'monospace',
              }}
            >
              {`{
  "topic": "Topic Name",
  "phrases": [
    {
      "phrase": "break the ice",
      "definition": "To make people feel more comfortable",
      "exampleSentences": [
        "He told a joke to break the ice.",
        "Breaking the ice at parties can be difficult."
      ],
      "image": "optional-image-url.jpg"
    }
  ]
}`}
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Requirements:</strong>
            </Typography>
            <Typography variant="body2" component="ul" sx={{ mt: 0.5, mb: 0 }}>
              <li>File must be in JSON format</li>
              <li>Must include "topic" (string)</li>
              <li>Must include "phrases" array with at least one phrase</li>
              <li>Each phrase must have: phrase, definition, and exampleSentences</li>
              <li>Image field is optional</li>
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={importMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={importMutation.isPending || !selectedFile}
        >
          {importMutation.isPending ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportTopicModal;
