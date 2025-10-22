import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  isUploading?: boolean;
  size?: number;
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const AvatarContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const AvatarImage = styled.img<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  object-fit: cover;
  border-radius: 50%;
`;

const AvatarPlaceholder = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.size * 0.3}px;
  font-weight: bold;
  text-transform: uppercase;
`;

const UploadOverlay = styled.div<{ size: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
  
  ${Container}:hover & {
    opacity: 1;
  }
`;

const UploadIcon = styled.div`
  color: white;
  font-size: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  ${props => props.variant === 'danger' ? `
    background: ${props.theme.colors.danger};
    color: white;
    
    &:hover {
      background: #c82333;
    }
  ` : `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid ${props => props.theme.colors.danger};
  }
`;

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userName = 'User',
  onUpload,
  onDelete,
  isUploading = false,
  size = 120,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPEG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setError(null);
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      try {
        setError(null);
        await onDelete();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed');
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <Container>
      <AvatarContainer size={size} onClick={handleUploadClick}>
        {currentAvatar ? (
          <AvatarImage src={currentAvatar} alt={userName} size={size} />
        ) : (
          <AvatarPlaceholder size={size}>
            {getInitials(userName)}
          </AvatarPlaceholder>
        )}
        
        <UploadOverlay size={size}>
          {isUploading ? (
            <LoadingSpinner />
          ) : (
            <UploadIcon>📷</UploadIcon>
          )}
        </UploadOverlay>
      </AvatarContainer>

      <ActionButtons>
        <ActionButton
          onClick={handleUploadClick}
          disabled={isUploading}
          title="Upload new avatar"
        >
          📷
        </ActionButton>
        {currentAvatar && onDelete && (
          <ActionButton
            variant="danger"
            onClick={handleDeleteClick}
            disabled={isUploading}
            title="Remove avatar"
          >
            🗑️
          </ActionButton>
        )}
      </ActionButtons>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
      />

      {error && (
        <ErrorMessage onClick={clearError}>
          {error}
        </ErrorMessage>
      )}
    </Container>
  );
};