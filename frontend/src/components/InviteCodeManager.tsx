import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminService, InviteCode } from '../services/adminService';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const GenerateButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const CodesGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const CodeCard = styled.div<{ isUsed: boolean; isActive: boolean }>`
  background: ${props => props.theme.colors.light};
  border: 1px solid ${props => {
    if (!props.isActive) return props.theme.colors.danger;
    if (props.isUsed) return props.theme.colors.success;
    return props.theme.colors.border;
  }};
  border-radius: 8px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  opacity: ${props => !props.isActive ? 0.6 : 1};
`;

const CodeValue = styled.div`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  letter-spacing: 2px;
`;

const CodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CodeMeta = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ status: 'active' | 'used' | 'inactive' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#007bff20';
      case 'used': return '#28a74520';
      case 'inactive': return '#dc354520';
      default: return '#6c757d20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.primary;
      case 'used': return props.theme.colors.success;
      case 'inactive': return props.theme.colors.danger;
      default: return props.theme.colors.textSecondary;
    }
  }};
`;

const DeactivateButton = styled.button`
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.danger};
    opacity: 0.9;
  }

  &:disabled {
    background: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  background: #dc354520;
  color: ${props => props.theme.colors.danger};
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: #28a74520;
  color: ${props => props.theme.colors.success};
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const InviteCodeManager: React.FC = () => {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInviteCodes();
  }, []);

  const loadInviteCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllInviteCodes();
      setCodes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load invite codes');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);
      setError(null);
      setSuccess(null);
      const result = await adminService.generateInviteCode();
      setSuccess(`Generated new invite code: ${result.code}`);
      await loadInviteCodes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate invite code');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeactivateCode = async (code: string) => {
    if (!confirm(`Are you sure you want to deactivate invite code ${code}?`)) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await adminService.deactivateInviteCode(code);
      setSuccess(`Invite code ${code} has been deactivated`);
      await loadInviteCodes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to deactivate invite code');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCodeStatus = (code: InviteCode): 'active' | 'used' | 'inactive' => {
    if (!code.isActive) return 'inactive';
    if (code.isUsed) return 'used';
    return 'active';
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading invite codes...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Invite Code Management</Title>
        <GenerateButton
          onClick={handleGenerateCode}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate New Code'}
        </GenerateButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {codes.length === 0 ? (
        <EmptyState>
          <p>No invite codes have been generated yet.</p>
          <p>Click "Generate New Code" to create your first invite code.</p>
        </EmptyState>
      ) : (
        <CodesGrid>
          {codes.map(code => (
            <CodeCard
              key={code.code}
              isUsed={code.isUsed}
              isActive={code.isActive}
            >
              <CodeValue>{code.code}</CodeValue>

              <CodeInfo>
                <CodeMeta>
                  Created by {code.creator.email} on {formatDate(code.createdAt)}
                </CodeMeta>
                {code.isUsed && code.usedByUser && (
                  <CodeMeta>
                    Used by {code.usedByUser.email} on {code.usedAt && formatDate(code.usedAt)}
                  </CodeMeta>
                )}
              </CodeInfo>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StatusBadge status={getCodeStatus(code)}>
                  {getCodeStatus(code)}
                </StatusBadge>

                {code.isActive && !code.isUsed && (
                  <DeactivateButton
                    onClick={() => handleDeactivateCode(code.code)}
                  >
                    Deactivate
                  </DeactivateButton>
                )}
              </div>
            </CodeCard>
          ))}
        </CodesGrid>
      )}
    </Container>
  );
};