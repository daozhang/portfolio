import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PortfolioCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
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
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const CardMeta = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const DashboardPage: React.FC = () => {
  // Mock data - will be replaced with real data
  const portfolios: any[] = [];

  return (
    <Container>
      <Header>
        <Title>My Portfolios</Title>
        <CreateButton>Create New Portfolio</CreateButton>
      </Header>
      
      {portfolios.length === 0 ? (
        <EmptyState>
          <h3>No portfolios yet</h3>
          <p>Create your first portfolio to get started</p>
        </EmptyState>
      ) : (
        <PortfolioGrid>
          {portfolios.map((portfolio: any) => (
            <PortfolioCard key={portfolio.id}>
              <CardImage>Portfolio Preview</CardImage>
              <CardContent>
                <CardTitle>{portfolio.title}</CardTitle>
                <CardMeta>
                  {portfolio.isPublished ? 'Published' : 'Draft'} • 
                  Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                </CardMeta>
                <CardActions>
                  <ActionButton className="primary">Edit</ActionButton>
                  <ActionButton>Preview</ActionButton>
                  <ActionButton>Share</ActionButton>
                </CardActions>
              </CardContent>
            </PortfolioCard>
          ))}
        </PortfolioGrid>
      )}
    </Container>
  );
};