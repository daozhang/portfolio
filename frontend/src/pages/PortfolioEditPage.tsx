import React from 'react';
import { PortfolioBuilderProvider } from '../contexts/PortfolioBuilderContext';
import { PortfolioBuilder } from '../components/PortfolioBuilder';

export const PortfolioEditPage: React.FC = () => {
  return (
    <PortfolioBuilderProvider>
      <PortfolioBuilder />
    </PortfolioBuilderProvider>
  );
};