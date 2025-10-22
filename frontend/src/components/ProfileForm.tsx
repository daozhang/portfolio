import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, UpdateProfileData } from '../services/profileService';

interface ProfileFormProps {
  profile: User;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  isLoading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.light};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.light};
    cursor: not-allowed;
  }
`;

const CharacterCount = styled.div<{ isNearLimit: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.isNearLimit ? props.theme.colors.warning : props.theme.colors.textSecondary};
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  ${props => props.variant === 'primary' ? `
    background-color: ${props.theme.colors.primary};
    color: white;
    border: 1px solid ${props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme.colors.primaryHover};
      border-color: ${props.theme.colors.primaryHover};
    }
  ` : `
    background-color: white;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme.colors.light};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ReadOnlyField = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.light};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.success};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: profile.name || '',
    bio: profile.bio || '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const maxBioLength = 500;
  const maxNameLength = 100;

  useEffect(() => {
    const hasNameChanged = formData.name !== (profile.name || '');
    const hasBioChanged = formData.bio !== (profile.bio || '');
    setHasChanges(hasNameChanged || hasBioChanged);
  }, [formData, profile]);

  const handleInputChange = (
    field: keyof UpdateProfileData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) return;

    try {
      await onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleReset = () => {
    setFormData({
      name: profile.name || '',
      bio: profile.bio || '',
    });
    setShowSuccess(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {showSuccess && (
        <SuccessMessage>
          Profile updated successfully!
        </SuccessMessage>
      )}

      <FormGroup>
        <Label htmlFor="email">Email Address</Label>
        <ReadOnlyField>{profile.email}</ReadOnlyField>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
          maxLength={maxNameLength}
          disabled={isLoading}
        />
        <CharacterCount isNearLimit={formData.name.length > maxNameLength * 0.8}>
          {formData.name.length}/{maxNameLength}
        </CharacterCount>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="bio">Bio</Label>
        <TextArea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself and your work..."
          maxLength={maxBioLength}
          disabled={isLoading}
        />
        <CharacterCount isNearLimit={formData.bio.length > maxBioLength * 0.8}>
          {formData.bio.length}/{maxBioLength}
        </CharacterCount>
      </FormGroup>

      <FormGroup>
        <Label>Account Role</Label>
        <ReadOnlyField style={{ textTransform: 'capitalize' }}>
          {profile.role}
        </ReadOnlyField>
      </FormGroup>

      <FormGroup>
        <Label>Member Since</Label>
        <ReadOnlyField>
          {formatDate(profile.createdAt)}
        </ReadOnlyField>
      </FormGroup>

      <ButtonGroup>
        <Button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isLoading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!hasChanges || isLoading}
        >
          {isLoading && <LoadingSpinner />}
          Save Changes
        </Button>
      </ButtonGroup>
    </Form>
  );
};