import React, { useState } from 'react';
import { Avatar, Dialog, DialogContent, Box, IconButton } from '@mui/material';
import { ImageNotSupported as NoImageIcon, Close as CloseIcon } from '@mui/icons-material';

interface ImageWithModalProps {
  src?: string;
  alt: string;
  size?: number;
}

const ImageWithModal: React.FC<ImageWithModalProps> = ({ src, alt, size = 60 }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleImageClick = () => {
    if (src) {
      setImageModalOpen(true);
    }
  };

  const handleImageModalClose = () => {
    setImageModalOpen(false);
  };

  return (
    <>
      {src ? (
        <Avatar
          src={src}
          alt={alt}
          variant="rounded"
          sx={{
            width: size,
            height: size,
            margin: '0 auto',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          onClick={handleImageClick}
        />
      ) : (
        <Avatar
          variant="rounded"
          sx={{ width: size, height: size, margin: '0 auto', bgcolor: 'grey.200' }}
        >
          <NoImageIcon sx={{ color: 'grey.400' }} />
        </Avatar>
      )}

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onClose={handleImageModalClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              bgcolor: 'grey.900',
            }}
          >
            {src && (
              <img
                src={src}
                alt={alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>
          <IconButton
            onClick={handleImageModalClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageWithModal;
