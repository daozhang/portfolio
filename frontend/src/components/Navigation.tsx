import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '400'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:first-child {
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 0.5rem 0;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.danger};
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 1rem 2rem;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '400'};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Don't show navigation on public portfolio pages
  if (location.pathname.startsWith('/p/')) {
    return null;
  }

  return (
    <NavContainer>
      <NavContent>
        <Logo to={isAuthenticated ? "/dashboard" : "/"}>
          Portfolio Platform
        </Logo>
        
        {isAuthenticated && (
          <>
            <NavLinks>
              <NavLink to="/dashboard" $active={isActivePath('/dashboard')}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" $active={isActivePath('/profile')}>
                Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" $active={isActivePath('/admin')}>
                  Admin
                </NavLink>
              )}
            </NavLinks>
            
            <UserMenu>
              <UserAvatar 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              >
                {getInitials(user?.name)}
              </UserAvatar>
              
              <DropdownMenu $isOpen={isDropdownOpen}>
                <DropdownItem to="/profile" onClick={() => setIsDropdownOpen(false)}>
                  Profile Settings
                </DropdownItem>
                <DropdownItem to="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                  My Portfolios
                </DropdownItem>
                {isAdmin && (
                  <>
                    <DropdownDivider />
                    <DropdownItem to="/admin" onClick={() => setIsDropdownOpen(false)}>
                      Admin Panel
                    </DropdownItem>
                    <DropdownItem to="/admin/invites" onClick={() => setIsDropdownOpen(false)}>
                      Manage Invites
                    </DropdownItem>
                    <DropdownItem to="/admin/users" onClick={() => setIsDropdownOpen(false)}>
                      Manage Users
                    </DropdownItem>
                  </>
                )}
                <DropdownDivider />
                <LogoutButton onClick={handleLogout}>
                  Sign Out
                </LogoutButton>
              </DropdownMenu>
            </UserMenu>
            
            <MobileMenuButton 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰
            </MobileMenuButton>
          </>
        )}
      </NavContent>
      
      {isAuthenticated && (
        <MobileMenu $isOpen={isMobileMenuOpen}>
          <MobileNavLink 
            to="/dashboard" 
            $active={isActivePath('/dashboard')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </MobileNavLink>
          <MobileNavLink 
            to="/profile" 
            $active={isActivePath('/profile')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </MobileNavLink>
          {isAdmin && (
            <>
              <MobileNavLink 
                to="/admin" 
                $active={isActivePath('/admin')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </MobileNavLink>
              <MobileNavLink 
                to="/admin/invites" 
                $active={isActivePath('/admin/invites')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manage Invites
              </MobileNavLink>
              <MobileNavLink 
                to="/admin/users" 
                $active={isActivePath('/admin/users')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manage Users
              </MobileNavLink>
            </>
          )}
        </MobileMenu>
      )}
    </NavContainer>
  );
};