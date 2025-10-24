import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Portfolio } from '../types/blocks';
import { PortfolioPublishModal } from './PortfolioPublishModal';
import { portfolioService } from '../services/portfolioService';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onUpdate: (updatedPortfolio: Portfolio) => void;
  onDelete: (portfolioId: string) => void;
}

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  position: relative;
`;

const PublishBadge = styled.div<{ isPublished: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.isPublished ? `
    background-color: rgba(34, 197, 94, 0.9);
    color: white;
  ` : `
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
  `}
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const PublicUrl = styled.a`
  color: ${props => props.theme.colors.primary};
  font-size: 0.85rem;
  text-decoration: none;
  word-break: break-all;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 80px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary};
          color: white;
          border-color: ${props.theme.colors.primary};
          &:hover {
            background-color: ${props.theme.colors.primaryHover};
          }
        `;
      case 'danger':
        return `
          background-color: white;
          color: ${props.theme.colors.danger};
          border-color: ${props.theme.colors.danger};
          &:hover {
            background-color: ${props.theme.colors.danger};
            color: white;
          }
        `;
      default:
        return `
          background: white;
          color: ${props.theme.colors.text};
          &:hover {
            background-color: ${props.theme.colors.background};
          }
        `;
    }
  }}
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  padding: 0.5rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 120px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &.danger {
    color: ${props => props.theme.colors.danger};
  }
`;

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const publicUrl = portfolio.publicUrl 
    ? `${window.location.origin}/p/${portfolio.publicUrl}`
    : '';

  const handleEdit = () => {
    navigate(`/portfolio/${portfolio.id}/edit`);
  };

  const handlePreview = () => {
    navigate(`/portfolio/${portfolio.id}/preview`);
  };

  const handlePublishChange = (isPublished: boolean, newPublicUrl?: string) => {
    const updatedPortfolio = {
      ...portfolio,
      isPublished,
      publicUrl: newPublicUrl || portfolio.publicUrl,
    };
    onUpdate(updatedPortfolio);
    setShowPublishModal(false);
  };

  const handleDuplicate = async () => {
    try {
      await portfolioService.duplicatePortfolio(portfolio.id);
      // Refresh the portfolio list - this would typically be handled by the parent component
      window.location.reload();
    } catch (error) {
      console.error('Error duplicating portfolio:', error);
      alert('Failed to duplicate portfolio. Please try again.');
    }
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await portfolioService.deletePortfolio(portfolio.id);
      onDelete(portfolio.id);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDropdown(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <CardImage>
          <PublishBadge isPublished={portfolio.isPublished}>
            {portfolio.isPublished ? 'Published' : 'Draft'}
          </PublishBadge>
          {portfolio.title}
        </CardImage>
        
        <CardContent>
          <CardTitle>{portfolio.title}</CardTitle>
          
          <CardMeta>
            <MetaItem>
              Template: {portfolio.template} • Updated {formatDate(portfolio.updatedAt)}
            </MetaItem>
            <MetaItem>
              {portfolio.blocks?.length || 0} blocks
            </MetaItem>
            {portfolio.isPublished && publicUrl && (
              <PublicUrl 
                href={publicUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {publicUrl}
              </PublicUrl>
            )}
          </CardMeta>
          
          <CardActions>
            <ActionButton variant="primary" onClick={handleEdit}>
              Edit
            </ActionButton>
            <ActionButton onClick={handlePreview}>
              Preview
            </ActionButton>
            <ActionButton onClick={() => setShowPublishModal(true)}>
              {portfolio.isPublished ? 'Manage' : 'Publish'}
            </ActionButton>
            
            <DropdownContainer>
              <DropdownButton 
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                ⋯
              </DropdownButton>
              <DropdownMenu isOpen={showDropdown}>
                <DropdownItem onClick={handleDuplicate}>
                  Duplicate
                </DropdownItem>
                <DropdownItem 
                  className="danger" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </CardActions>
        </CardContent>
      </Card>

      <PortfolioPublishModal
        portfolio={portfolio}
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublishChange={handlePublishChange}
      />
    </>
  );
};