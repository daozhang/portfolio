import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminService, AdminDashboardStats } from '../services/adminService';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.light};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RecentUsersSection = styled.div`
  background: ${props => props.theme.colors.light};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserEmail = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const UserMeta = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background: ${props => props.role === 'admin'
    ? props.theme.colors.danger + '20'
    : props.theme.colors.primary + '20'};
  color: ${props => props.role === 'admin'
    ? props.theme.colors.danger
    : props.theme.colors.primary};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.danger + '20'};
  color: ${props => props.theme.colors.danger};
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Loading dashboard...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </DashboardContainer>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <DashboardContainer>
      <Title>Admin Dashboard</Title>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.totalArtists}</StatValue>
          <StatLabel>Artists</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.totalAdmins}</StatValue>
          <StatLabel>Admins</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.totalPortfolios}</StatValue>
          <StatLabel>Portfolios</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.activeInviteCodes}</StatValue>
          <StatLabel>Active Invite Codes</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.usedInviteCodes}</StatValue>
          <StatLabel>Used Invite Codes</StatLabel>
        </StatCard>
      </StatsGrid>

      <RecentUsersSection>
        <SectionTitle>Recent Users</SectionTitle>
        <UsersList>
          {stats.recentUsers.map(user => (
            <UserItem key={user.id}>
              <UserInfo>
                <UserEmail>{user.email}</UserEmail>
                <UserMeta>
                  {user.name && `${user.name} • `}
                  {user.portfolioCount} portfolios •
                  Joined {formatDate(user.createdAt)}
                </UserMeta>
              </UserInfo>
              <RoleBadge role={user.role}>{user.role}</RoleBadge>
            </UserItem>
          ))}
        </UsersList>
      </RecentUsersSection>
    </DashboardContainer>
  );
};