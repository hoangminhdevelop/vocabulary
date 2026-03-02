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
import { useImportVocabularyTopic } from '../../hooks/useVocabulary';

interface ImportTopicModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportData {
  topic: string;
  words: {
    word: string;
    type: string;
    IPA: string;
    definition: string;
    exampleSentences: string[];
    image?: string;
  }[];
}

const ImportTopicModal: React.FC<ImportTopicModalProps> = ({ open, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { showSuccess } = useApp();
  const importMutation = useImportVocabularyTopic();

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

    if (!Array.isArray(data.words)) {
      throw new Error('Missing or invalid "words" field - must be an array');
    }

    if (data.words.length === 0) {
      throw new Error('Words array cannot be empty');
    }

    for (let i = 0; i < data.words.length; i++) {
      const word = data.words[i];
      if (!word.word || typeof word.word !== 'string') {
        throw new Error(`Word at index ${i}: missing or invalid "word" field`);
      }
      if (!word.type || typeof word.type !== 'string') {
        throw new Error(`Word at index ${i}: missing or invalid "type" field`);
      }
      if (!word.IPA || typeof word.IPA !== 'string') {
        throw new Error(`Word at index ${i}: missing or invalid "IPA" field`);
      }
      if (!word.definition || typeof word.definition !== 'string') {
        throw new Error(`Word at index ${i}: missing or invalid "definition" field`);
      }
      if (!Array.isArray(word.exampleSentences)) {
        throw new Error(`Word at index ${i}: "exampleSentences" must be an array`);
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
  "words": [
    {
      "word": "example",
      "type": "noun",
      "IPA": "/ɪɡˈzæmpəl/",
      "definition": "A thing characteristic of its kind",
      "exampleSentences": [
        "This is an example sentence.",
        "Here is another example."
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
              <li>Must include "words" array with at least one word</li>
              <li>Each word must have: word, type, IPA, definition, and exampleSentences</li>
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
