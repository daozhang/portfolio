import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const FormContainer = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
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

const Button = styled.button`
  padding: 0.75rem;
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

const Link = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const RegisterPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <Container>
      <FormContainer>
        <Title>Create Account</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              type="text"
              placeholder="Enter 6-digit invite code"
              maxLength={6}
              required
            />
          </FormGroup>
          <Button type="submit">Create Account</Button>
          <Link href="/">Already have an account? Sign in</Link>
        </Form>
      </FormContainer>
    </Container>
  );
};