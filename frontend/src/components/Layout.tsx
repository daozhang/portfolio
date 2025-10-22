import React from 'react';
import styled from 'styled-components';
import { Navigation } from './Navigation';
import { Breadcrumb } from './Breadcrumb';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{
    label: string;
    path?: string;
  }>;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBreadcrumb = true,
  breadcrumbItems 
}) => {
  return (
    <LayoutContainer>
      <Navigation />
      {showBreadcrumb && <Breadcrumb items={breadcrumbItems} />}
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};