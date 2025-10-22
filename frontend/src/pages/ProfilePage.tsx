import React from 'react';
import styled from 'styled-components';

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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
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
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  color: ${props => props.theme.colors.text};
  border-radius: 6px;
  font-size: 1rem;
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

export const ProfilePage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
  };

  return (
    <Container>
      <Header>
        <Title>Profile Settings</Title>
        <Subtitle>Manage your account information and preferences</Subtitle>
      </Header>
      
      <ProfileCard>
        <AvatarSection>
          <AvatarContainer>
            <Avatar>JD</Avatar>
            <AvatarUpload>📷</AvatarUpload>
          </AvatarContainer>
          <UserInfo>
            <UserName>John Doe</UserName>
            <UserEmail>john.doe@example.com</UserEmail>
            <UserRole>artist</UserRole>
          </UserInfo>
        </AvatarSection>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              defaultValue="John Doe"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="bio">Bio</Label>
            <TextArea
              id="bio"
              placeholder="Tell us about yourself and your work..."
              defaultValue=""
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              defaultValue="john.doe@example.com"
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button">Cancel</Button>
            <Button type="submit" className="primary">Save Changes</Button>
          </ButtonGroup>
        </Form>
      </ProfileCard>
    </Container>
  );
};