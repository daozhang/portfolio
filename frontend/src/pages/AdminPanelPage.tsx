import React, { useState } from 'react';
import styled from 'styled-components';
import { AdminDashboard } from '../components/AdminDashboard';
import { InviteCodeManager } from '../components/InviteCodeManager';
import { UserManager } from '../components/UserManager';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 2rem 0;
`;

const SidebarTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active: boolean }>`
  margin: 0;
`;

const NavButton = styled.button<{ active: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${props => props.active ? props.theme.colors.primary + '20' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

type AdminView = 'dashboard' | 'invites' | 'users';

export const AdminPanelPage: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'invites':
        return <InviteCodeManager />;
      case 'users':
        return <UserManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>Admin Panel</SidebarTitle>
        <NavList>
          <NavItem active={activeView === 'dashboard'}>
            <NavButton 
              active={activeView === 'dashboard'}
              onClick={() => setActiveView('dashboard')}
            >
              Dashboard
            </NavButton>
          </NavItem>
          <NavItem active={activeView === 'invites'}>
            <NavButton 
              active={activeView === 'invites'}
              onClick={() => setActiveView('invites')}
            >
              Invite Codes
            </NavButton>
          </NavItem>
          <NavItem active={activeView === 'users'}>
            <NavButton 
              active={activeView === 'users'}
              onClick={() => setActiveView('users')}
            >
              User Management
            </NavButton>
          </NavItem>
        </NavList>
      </Sidebar>
      
      <MainContent>
        {renderContent()}
      </MainContent>
    </Container>
  );
};