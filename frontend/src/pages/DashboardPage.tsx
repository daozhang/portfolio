import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Portfolio } from '../types/blocks';
import { portfolioService } from '../services/portfolioService';
import { PortfolioCard } from '../components/PortfolioCard';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.danger};
`;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await portfolioService.getUserPortfolios();
      setPortfolios(data);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError('Failed to load portfolios. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      const newPortfolio = await portfolioService.createPortfolio({
        title: 'Untitled Portfolio',
        template: 'gallery',
      });
      navigate(`/portfolio/${newPortfolio.id}/edit`);
    } catch (err) {
      console.error('Error creating portfolio:', err);
      alert('Failed to create portfolio. Please try again.');
    }
  };

  const handlePortfolioUpdate = (updatedPortfolio: Portfolio) => {
    setPortfolios(prev => 
      prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p)
    );
  };

  const handlePortfolioDelete = (portfolioId: string) => {
    setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading your portfolios...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <h3>Error</h3>
          <p>{error}</p>
          <CreateButton onClick={fetchPortfolios}>Try Again</CreateButton>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Portfolios</Title>
        <CreateButton onClick={handleCreatePortfolio}>
          Create New Portfolio
        </CreateButton>
      </Header>
      
      {portfolios.length === 0 ? (
        <EmptyState>
          <h3>No portfolios yet</h3>
          <p>Create your first portfolio to get started</p>
        </EmptyState>
      ) : (
        <PortfolioGrid>
          {portfolios.map((portfolio) => (
            <PortfolioCard 
              key={portfolio.id}
              portfolio={portfolio}
              onUpdate={handlePortfolioUpdate}
              onDelete={handlePortfolioDelete}
            />
          ))}
        </PortfolioGrid>
      )}
    </Container>
  );
};