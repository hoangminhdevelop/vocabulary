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
  LinearProgress,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useCreatePhrase } from '../../hooks/usePhrases';

interface ImportPhrasesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topicId: string;
}

interface ImportPhrase {
  phrase: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
}

const ImportPhrasesModal: React.FC<ImportPhrasesModalProps> = ({
  open,
  onClose,
  onSuccess,
  topicId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { showSuccess, setError } = useApp();
  const createPhraseMutation = useCreatePhrase();

  const handleClose = () => {
    if (importing) return;
    setSelectedFile(null);
    setValidationError(null);
    setProgress({ current: 0, total: 0 });
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

  const validateStructure = (data: unknown): data is ImportPhrase[] => {
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of phrases');
    }

    if (data.length === 0) {
      throw new Error('Phrases array cannot be empty');
    }

    for (let i = 0; i < data.length; i++) {
      const phrase = data[i];
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
      setImporting(true);

      const fileContent = await selectedFile.text();
      const data = JSON.parse(fileContent);

      validateStructure(data);

      setProgress({ current: 0, total: data.length });

      // Import phrases one by one, tracking successes and skips
      let successCount = 0;
      const skippedPhrases: string[] = [];

      for (let i = 0; i < data.length; i++) {
        const phrase = data[i];
        try {
          await createPhraseMutation.mutateAsync({
            topicId,
            ...phrase,
          });
          successCount++;
        } catch (err: unknown) {
          // If it's a duplicate error, skip and continue
          if (err && typeof err === 'object' && 'response' in err) {
            const error = err as { response?: { data?: { message?: string } } };
            if (error?.response?.data?.message?.includes('already exists')) {
              skippedPhrases.push(phrase.phrase);
            } else {
              // For other errors, re-throw
              throw err;
            }
          } else {
            throw err;
          }
        }
        setProgress({ current: i + 1, total: data.length });
      }

      // Show summary message
      let summaryMessage = `Successfully imported ${successCount} phrase${successCount !== 1 ? 's' : ''}`;
      if (skippedPhrases.length > 0) {
        summaryMessage += `. Skipped ${skippedPhrases.length} duplicate${skippedPhrases.length !== 1 ? 's' : ''}`;
      }
      showSuccess(summaryMessage);

      setSelectedFile(null);
      setProgress({ current: 0, total: 0 });
      setImporting(false);
      onSuccess();
      onClose();
    } catch (error) {
      setImporting(false);
      if (error instanceof SyntaxError) {
        setValidationError('Invalid JSON format');
      } else if (error instanceof Error) {
        setValidationError(error.message);
        setError(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Phrases from JSON</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              disabled={importing}
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

          {importing && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Importing {progress.current} of {progress.total} phrases...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(progress.current / progress.total) * 100}
              />
            </Box>
          )}

          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Expected JSON Structure (Array):
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
              {`[
  {
    "phrase": "break the ice",
    "definition": "To initiate conversation in a social setting",
    "exampleSentences": [
      "He told a joke to break the ice.",
      "Small talk helps break the ice at parties."
    ],
    "image": "optional-image-url.jpg"
  },
  {
    "phrase": "piece of cake",
    "definition": "Something very easy to do",
    "exampleSentences": [
      "The exam was a piece of cake.",
      "Fixing this is a piece of cake."
    ]
  }
]`}
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Requirements:</strong>
            </Typography>
            <Typography variant="body2" component="ul" sx={{ mt: 0.5, mb: 0 }}>
              <li>File must be a JSON array</li>
              <li>Each phrase must have: phrase, definition, and exampleSentences</li>
              <li>Image field is optional</li>
              <li>Phrases will be added to the current topic</li>
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={importing}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={importing || !selectedFile}>
          {importing ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportPhrasesModal;
