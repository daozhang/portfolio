import React from 'react';
import styled from 'styled-components';

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

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const UserTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 120px 120px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${props => props.theme.colors.background};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 120px 120px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const RoleBadge = styled.span<{ role: 'artist' | 'admin' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => props.role === 'admin' ? `
    background: #fff2e8;
    color: #fa8c16;
  ` : `
    background: #e6f7ff;
    color: #1890ff;
  `}
`;

const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => props.active ? `
    background: #f6ffed;
    color: #52c41a;
  ` : `
    background: #fff2f0;
    color: #ff4d4f;
  `}
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  color: ${props => props.theme.colors.text};
  border-radius: 4px;
  font-size: 0.8rem;
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

export const AdminUsersPage: React.FC = () => {
  // Mock data - will be replaced with real data
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'artist' as const,
      isActive: true,
      portfolioCount: 3,
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'artist' as const,
      isActive: true,
      portfolioCount: 1,
      joinedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
      isActive: true,
      portfolioCount: 0,
      joinedAt: '2024-01-01'
    }
  ];

  const stats = {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    artists: users.filter(user => user.role === 'artist').length,
    admins: users.filter(user => user.role === 'admin').length
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleRoleChange = (userId: string, newRole: 'artist' | 'admin') => {
    // TODO: Implement role change
    console.log('Change role for user:', userId, 'to:', newRole);
  };

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <SearchBar>
          <SearchInput placeholder="Search users..." />
          <FilterSelect>
            <option value="all">All Users</option>
            <option value="artist">Artists</option>
            <option value="admin">Admins</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FilterSelect>
        </SearchBar>
      </Header>
      
      <StatsBar>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.artists}</StatValue>
          <StatLabel>Artists</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.admins}</StatValue>
          <StatLabel>Admins</StatLabel>
        </StatCard>
      </StatsBar>
      
      <UserTable>
        <TableHeader>
          <div></div>
          <div>User</div>
          <div>Joined</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </TableHeader>
        
        {users.length === 0 ? (
          <EmptyState>
            <h3>No users found</h3>
            <p>Users will appear here once they register</p>
          </EmptyState>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <div>
                <Avatar>{getInitials(user.name)}</Avatar>
              </div>
              <div>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
              </div>
              <div>{new Date(user.joinedAt).toLocaleDateString()}</div>
              <div>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
              </div>
              <div>
                <StatusBadge active={user.isActive}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </div>
              <div>
                {user.role === 'artist' ? (
                  <ActionButton 
                    className="primary"
                    onClick={() => handleRoleChange(user.id, 'admin')}
                  >
                    Make Admin
                  </ActionButton>
                ) : (
                  <ActionButton 
                    onClick={() => handleRoleChange(user.id, 'artist')}
                  >
                    Remove Admin
                  </ActionButton>
                )}
              </div>
            </TableRow>
          ))
        )}
      </UserTable>
    </Container>
  );
};