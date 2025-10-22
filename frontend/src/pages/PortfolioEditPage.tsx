import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: white;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  color: ${props => props.theme.colors.text};
  border-radius: 4px;
  font-size: 0.9rem;
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

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${props => props.theme.colors.background};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BlockItem = styled.div`
  padding: 0.75rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const Canvas = styled.div`
  flex: 1;
  background: white;
  padding: 2rem;
  overflow-y: auto;
`;

const CanvasContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  min-height: 600px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export const PortfolioEditPage: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>();

  const blockTypes = [
    { type: 'title', label: 'Title' },
    { type: 'richtext', label: 'Rich Text' },
    { type: 'list', label: 'List' },
    { type: 'images', label: 'Images' },
    { type: 'resume', label: 'Resume' },
    { type: 'carousel', label: 'Carousel' },
    { type: 'divider', label: 'Divider' },
    { type: 'link', label: 'Link' }
  ];

  return (
    <Container>
      <Header>
        <Title>Portfolio Editor</Title>
        <HeaderActions>
          <Button>Preview</Button>
          <Button>Save Draft</Button>
          <Button className="primary">Publish</Button>
        </HeaderActions>
      </Header>
      
      <EditorContainer>
        <Sidebar>
          <SidebarSection>
            <SectionTitle>Blocks</SectionTitle>
            <BlockList>
              {blockTypes.map((block) => (
                <BlockItem key={block.type}>
                  {block.label}
                </BlockItem>
              ))}
            </BlockList>
          </SidebarSection>
          
          <SidebarSection>
            <SectionTitle>Templates</SectionTitle>
            <BlockList>
              <BlockItem>Gallery</BlockItem>
              <BlockItem>About</BlockItem>
              <BlockItem>Contact</BlockItem>
            </BlockList>
          </SidebarSection>
        </Sidebar>
        
        <Canvas>
          <CanvasContent>
            Drag blocks here to start building your portfolio
          </CanvasContent>
        </Canvas>
      </EditorContainer>
    </Container>
  );
};