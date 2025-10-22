import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  color: ${props => props.theme.colors.text};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryHover};
    }
  }
`;

const ViewportToggle = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ViewportButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.background};
  }
`;

const PreviewContainer = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
`;

const PreviewFrame = styled.div<{ viewport: 'desktop' | 'mobile' }>`
  width: ${props => props.viewport === 'mobile' ? '375px' : '100%'};
  max-width: ${props => props.viewport === 'desktop' ? '1200px' : '375px'};
  min-height: 600px;
  background: white;
  border: ${props => props.viewport === 'mobile' ? '1px solid #ccc' : 'none'};
  border-radius: ${props => props.viewport === 'mobile' ? '12px' : '0'};
  box-shadow: ${props => props.viewport === 'mobile' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const PreviewContent = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export const PortfolioPreviewPage: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>();
  const [viewport, setViewport] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <Container>
      <Header>
        <Title>Portfolio Preview</Title>
        <HeaderActions>
          <ViewportToggle>
            <ViewportButton 
              active={viewport === 'desktop'}
              onClick={() => setViewport('desktop')}
            >
              Desktop
            </ViewportButton>
            <ViewportButton 
              active={viewport === 'mobile'}
              onClick={() => setViewport('mobile')}
            >
              Mobile
            </ViewportButton>
          </ViewportToggle>
          <Button>Back to Editor</Button>
          <Button className="primary">Publish</Button>
        </HeaderActions>
      </Header>
      
      <PreviewContainer>
        <PreviewFrame viewport={viewport}>
          <PreviewContent>
            <h2>Portfolio Preview</h2>
            <p>Your portfolio content will appear here</p>
            <p>Currently viewing in {viewport} mode</p>
          </PreviewContent>
        </PreviewFrame>
      </PreviewContainer>
    </Container>
  );
};