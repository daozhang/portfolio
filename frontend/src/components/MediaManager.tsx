import React, { useState } from 'react';
import styled from 'styled-components';
import { MediaUpload } from './MediaUpload';
import { MediaGallery } from './MediaGallery';
import { MediaFile } from '../services/mediaService';

interface MediaManagerProps {
  portfolioId?: string;
  onMediaSelect?: (media: MediaFile) => void;
  showUpload?: boolean;
  showProjectDetails?: boolean;
  selectable?: boolean;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled.div`
  padding-top: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: ${props => props.theme.colors.success || '#10B981'}10;
  border: 1px solid ${props => props.theme.colors.success || '#10B981'}30;
  color: ${props => props.theme.colors.success || '#10B981'};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.danger}10;
  border: 1px solid ${props => props.theme.colors.danger}30;
  color: ${props => props.theme.colors.danger};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const MediaManager: React.FC<MediaManagerProps> = ({
  portfolioId,
  onMediaSelect,
  showUpload = true,
  showProjectDetails = true,
  selectable = false,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>(showUpload ? 'upload' : 'gallery');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = (_mediaFile: MediaFile) => {
    setMessage({ type: 'success', text: 'Media file uploaded successfully!' });
    setRefreshGallery(prev => prev + 1);
    
    // Auto-switch to gallery tab after successful upload
    if (showUpload) {
      setTimeout(() => {
        setActiveTab('gallery');
      }, 1000);
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleUploadError = (error: string) => {
    setMessage({ type: 'error', text: error });
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleMediaDelete = (_mediaId: string) => {
    setMessage({ type: 'success', text: 'Media file deleted successfully!' });
    setRefreshGallery(prev => prev + 1);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <Container className={className}>
      {showUpload && (
        <TabContainer>
          <Tab
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
          >
            Upload Media
          </Tab>
          <Tab
            active={activeTab === 'gallery'}
            onClick={() => setActiveTab('gallery')}
          >
            Media Gallery
          </Tab>
        </TabContainer>
      )}

      {message && (
        message.type === 'success' ? (
          <SuccessMessage>{message.text}</SuccessMessage>
        ) : (
          <ErrorMessage>{message.text}</ErrorMessage>
        )
      )}

      <TabContent>
        {activeTab === 'upload' && showUpload && (
          <MediaUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            showProjectDetails={showProjectDetails}
          />
        )}

        {activeTab === 'gallery' && (
          <MediaGallery
            key={refreshGallery} // Force re-render when refreshGallery changes
            portfolioId={portfolioId}
            onMediaSelect={onMediaSelect}
            onMediaDelete={handleMediaDelete}
            selectable={selectable}
          />
        )}
      </TabContent>
    </Container>
  );
};