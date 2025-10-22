import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryHover};
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.primary};
      color: white;
    }
  }
`;

export const LandingPage: React.FC = () => {
  return (
    <Container>
      <Title>Designer Portfolio Platform</Title>
      <Subtitle>
        Create stunning portfolios with our drag-and-drop builder. 
        Showcase your work professionally and share it with the world.
      </Subtitle>
      <ButtonGroup>
        <Button className="primary">Sign In</Button>
        <Button className="secondary">Register</Button>
      </ButtonGroup>
    </Container>
  );
};