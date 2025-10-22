import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbContainer = styled.nav`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const BreadcrumbContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  
  &:not(:last-child)::after {
    content: '/';
    margin-left: 0.5rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const BreadcrumbLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbText = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/dashboard' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map path segments to readable labels
      let label = segment;
      switch (segment) {
        case 'dashboard':
          label = 'Dashboard';
          break;
        case 'profile':
          label = 'Profile';
          break;
        case 'admin':
          label = 'Admin Panel';
          break;
        case 'invites':
          label = 'Invite Management';
          break;
        case 'users':
          label = 'User Management';
          break;
        case 'portfolio':
          label = 'Portfolio';
          break;
        case 'edit':
          label = 'Editor';
          break;
        case 'preview':
          label = 'Preview';
          break;
        default:
          // For IDs and other segments, capitalize first letter
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
      
      // Don't add link for the current page (last segment)
      const isLast = index === pathSegments.length - 1;
      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  // Don't show breadcrumbs on landing page, register page, or public portfolios
  if (location.pathname === '/' || 
      location.pathname === '/register' || 
      location.pathname.startsWith('/p/') ||
      breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <BreadcrumbContainer>
      <BreadcrumbContent>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.path ? (
                <BreadcrumbLink to={item.path}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbText>{item.label}</BreadcrumbText>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </BreadcrumbContent>
    </BreadcrumbContainer>
  );
};