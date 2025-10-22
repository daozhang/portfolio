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

const GenerateButton = styled.button`
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

const InviteTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${props => props.theme.colors.background};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 120px;
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

const InviteCode = styled.code`
  background: ${props => props.theme.colors.background};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const StatusBadge = styled.span<{ status: 'active' | 'used' | 'inactive' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: #e6f7ff;
          color: #1890ff;
        `;
      case 'used':
        return `
          background: #f6ffed;
          color: #52c41a;
        `;
      case 'inactive':
        return `
          background: #fff2e8;
          color: #fa8c16;
        `;
      default:
        return '';
    }
  }}
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
  
  &.danger {
    color: #ff4d4f;
    border-color: #ff4d4f;
    
    &:hover {
      background-color: #fff2f0;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const AdminInvitesPage: React.FC = () => {
  // Mock data - will be replaced with real data
  const inviteCodes = [
    {
      code: 'ABC123',
      status: 'used' as const,
      createdAt: '2024-01-15',
      usedBy: 'john.doe@example.com',
      usedAt: '2024-01-16'
    },
    {
      code: 'DEF456',
      status: 'active' as const,
      createdAt: '2024-01-20',
      usedBy: null,
      usedAt: null
    },
    {
      code: 'GHI789',
      status: 'active' as const,
      createdAt: '2024-01-22',
      usedBy: null,
      usedAt: null
    }
  ];

  const stats = {
    total: inviteCodes.length,
    active: inviteCodes.filter(code => code.status === 'active').length,
    used: inviteCodes.filter(code => code.status === 'used').length,
    inactive: 0 // No inactive codes in mock data
  };

  const handleGenerateCode = () => {
    // TODO: Implement invite code generation
    console.log('Generate new invite code');
  };

  const handleDeactivateCode = (code: string) => {
    // TODO: Implement invite code deactivation
    console.log('Deactivate code:', code);
  };

  return (
    <Container>
      <Header>
        <Title>Invite Code Management</Title>
        <GenerateButton onClick={handleGenerateCode}>
          Generate New Code
        </GenerateButton>
      </Header>
      
      <StatsBar>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Codes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.used}</StatValue>
          <StatLabel>Used</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>Inactive</StatLabel>
        </StatCard>
      </StatsBar>
      
      <InviteTable>
        <TableHeader>
          <div>Code</div>
          <div>Status</div>
          <div>Created</div>
          <div>Used By</div>
          <div>Actions</div>
        </TableHeader>
        
        {inviteCodes.length === 0 ? (
          <EmptyState>
            <h3>No invite codes yet</h3>
            <p>Generate your first invite code to get started</p>
          </EmptyState>
        ) : (
          inviteCodes.map((invite) => (
            <TableRow key={invite.code}>
              <div>
                <InviteCode>{invite.code}</InviteCode>
              </div>
              <div>
                <StatusBadge status={invite.status}>
                  {invite.status}
                </StatusBadge>
              </div>
              <div>{new Date(invite.createdAt).toLocaleDateString()}</div>
              <div>{invite.usedBy || '-'}</div>
              <div>
                {invite.status === 'active' && (
                  <ActionButton 
                    className="danger"
                    onClick={() => handleDeactivateCode(invite.code)}
                  >
                    Deactivate
                  </ActionButton>
                )}
              </div>
            </TableRow>
          ))
        )}
      </InviteTable>
    </Container>
  );
};