import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { VolumeUp as VolumeUpIcon } from '@mui/icons-material';

interface SpeakButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
  language?: string;
}

const SpeakButton: React.FC<SpeakButtonProps> = ({ text, size = 'small', language = 'en-US' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8; // Slightly slower for clearer pronunciation

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Tooltip title="Speak word">
      <IconButton
        size={size}
        onClick={handleSpeak}
        disabled={isSpeaking}
        aria-label="speak word"
        sx={{
          color: isSpeaking ? 'primary.main' : 'action.active',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <VolumeUpIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export default SpeakButton;
