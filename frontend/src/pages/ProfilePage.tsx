import React, { useState } from 'react';
import styled from 'styled-components';
import { useProfile } from '../hooks/useProfile';
import { AvatarUpload } from '../components/AvatarUpload';
import { ProfileForm } from '../components/ProfileForm';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
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

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.md};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  background: ${props => props.theme.colors.danger};
  color: white;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 2rem;
  text-align: center;
`;

const RetryButton = styled.button`
  background: white;
  color: ${props => props.theme.colors.danger};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.theme.colors.light};
  }
`;

export const ProfilePage: React.FC = () => {
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    isUploading,
    refreshProfile,
  } = useProfile();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      await updateProfile(data);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    await uploadAvatar(file);
  };

  const handleAvatarDelete = async () => {
    await deleteAvatar();
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  if (error && !profile) {
    return (
      <Container>
        <ErrorContainer>
          <div>Failed to load profile: {error}</div>
          <RetryButton onClick={refreshProfile}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <ErrorContainer>
          <div>Profile not found</div>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Profile Settings</Title>
        <Subtitle>Manage your account information and preferences</Subtitle>
      </Header>
      
      {error && (
        <ErrorContainer>
          {error}
        </ErrorContainer>
      )}
      
      <ProfileCard>
        <AvatarSection>
          <AvatarUpload
            currentAvatar={profile.avatar}
            userName={profile.name || profile.email}
            onUpload={handleAvatarUpload}
            onDelete={profile.avatar ? handleAvatarDelete : undefined}
            isUploading={isUploading}
            size={120}
          />
          <UserInfo>
            <UserName>{profile.name || 'No name set'}</UserName>
            <UserEmail>{profile.email}</UserEmail>
            <UserRole>{profile.role}</UserRole>
          </UserInfo>
        </AvatarSection>
        
        <ProfileForm
          profile={profile}
          onSubmit={handleProfileUpdate}
          isLoading={isUpdating}
        />
      </ProfileCard>
    </Container>
  );
};