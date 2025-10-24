import React, { useState } from 'react';
import styled from 'styled-components';
import { Portfolio } from '../types/blocks';
import { portfolioService } from '../services/portfolioService';
import { universalShare } from '../utils/sharingUtils';

interface PortfolioPublishModalProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onPublishChange: (isPublished: boolean, publicUrl?: string) => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  margin-bottom: 2rem;
`;

const StatusSection = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  background-color: ${props => props.theme.colors.background};
`;

const StatusLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const StatusValue = styled.div<{ isPublished: boolean }>`
  color: ${props => props.isPublished ? props.theme.colors.success : props.theme.colors.warning};
  font-weight: 500;
`;

const PublicUrlSection = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 1rem;
`;

const UrlContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const CopyButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.dark};
  }
`;

const ShareButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${props.theme.colors.primaryHover};
          }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.danger};
          color: white;
          &:hover {
            background-color: #c82333;
          }
        `;
      default:
        return `
          background-color: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          &:hover {
            background-color: ${props.theme.colors.light};
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const PortfolioPublishModal: React.FC<PortfolioPublishModalProps> = ({
  portfolio,
  isOpen,
  onClose,
  onPublishChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicUrl = portfolio.publicUrl 
    ? `${window.location.origin}/p/${portfolio.publicUrl}`
    : '';

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedPortfolio = await portfolioService.publishPortfolio(portfolio.id, {
        isPublished: true,
      });
      
      onPublishChange(true, updatedPortfolio.publicUrl);
    } catch (err) {
      setError('Failed to publish portfolio. Please try again.');
      console.error('Error publishing portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await portfolioService.publishPortfolio(portfolio.id, {
        isPublished: false,
      });
      
      onPublishChange(false);
    } catch (err) {
      setError('Failed to unpublish portfolio. Please try again.');
      console.error('Error unpublishing portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert('Portfolio URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL. Please copy it manually.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: portfolio.title,
      text: `Check out my portfolio: ${portfolio.title}`,
      url: publicUrl,
    };

    await universalShare(shareData);
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Portfolio Publishing</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Content>
          <StatusSection>
            <StatusLabel>Current Status:</StatusLabel>
            <StatusValue isPublished={portfolio.isPublished}>
              {portfolio.isPublished ? 'Published' : 'Draft'}
            </StatusValue>
            
            <PublicUrlSection show={portfolio.isPublished && !!portfolio.publicUrl}>
              <StatusLabel>Public URL:</StatusLabel>
              <UrlContainer>
                <UrlInput 
                  value={publicUrl} 
                  readOnly 
                  placeholder="Portfolio will be available at a public URL"
                />
                <CopyButton onClick={handleCopyUrl}>Copy</CopyButton>
                <ShareButton onClick={handleShare}>Share</ShareButton>
              </UrlContainer>
            </PublicUrlSection>
          </StatusSection>

          {portfolio.isPublished ? (
            <Description>
              Your portfolio is currently published and accessible to anyone with the link. 
              You can unpublish it to make it private again.
            </Description>
          ) : (
            <Description>
              Publishing your portfolio will make it accessible to anyone with the link. 
              A unique public URL will be generated for sharing.
            </Description>
          )}

          {error && (
            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
        </Content>

        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          {portfolio.isPublished ? (
            <Button 
              variant="danger" 
              onClick={handleUnpublish}
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner />}
              Unpublish
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner />}
              Publish Portfolio
            </Button>
          )}
        </Actions>
      </Modal>
    </Overlay>
  );
};