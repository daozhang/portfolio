import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
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

const RecentActivity = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export const AdminPanelPage: React.FC = () => {
  // Mock data - will be replaced with real data
  const stats = {
    totalUsers: 42,
    activePortfolios: 28,
    pendingInvites: 5,
    totalInvites: 50
  };

  const recentActivity = [
    { text: 'New user registered: jane.smith@example.com', time: '2 hours ago' },
    { text: 'Portfolio published by john.doe@example.com', time: '4 hours ago' },
    { text: 'Invite code generated: ABC123', time: '1 day ago' },
    { text: 'User updated profile: mike.wilson@example.com', time: '2 days ago' }
  ];

  return (
    <Container>
      <Header>
        <Title>Admin Panel</Title>
        <Subtitle>Manage users, invite codes, and system settings</Subtitle>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.activePortfolios}</StatValue>
          <StatLabel>Active Portfolios</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.pendingInvites}</StatValue>
          <StatLabel>Pending Invites</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalInvites}</StatValue>
          <StatLabel>Total Invites</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <QuickActions>
        <ActionCard>
          <ActionTitle>Manage Invite Codes</ActionTitle>
          <ActionDescription>
            Generate new invite codes, view usage status, and deactivate unused codes.
          </ActionDescription>
          <ActionButton>Manage Invites</ActionButton>
        </ActionCard>
        
        <ActionCard>
          <ActionTitle>User Management</ActionTitle>
          <ActionDescription>
            View all users, manage roles, and monitor user activity across the platform.
          </ActionDescription>
          <ActionButton>Manage Users</ActionButton>
        </ActionCard>
      </QuickActions>
      
      <RecentActivity>
        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityList>
          {recentActivity.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityInfo>
                <ActivityText>{activity.text}</ActivityText>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityInfo>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivity>
    </Container>
  );
};