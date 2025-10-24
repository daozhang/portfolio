import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePortfolioBuilder } from '../contexts/PortfolioBuilderContext';
import { DraggableBlockPalette, DraggableBlockInstance, DropZone } from './dnd';
import { BlockRenderer } from './BlockRenderer';
import { ViewportSwitcher } from './ViewportSwitcher';
import { PreviewCanvas } from './PreviewCanvas';
import { PortfolioPublishModal } from './PortfolioPublishModal';
import { BlockType, Portfolio } from '../types/blocks';
import { DragItem, DND_ITEM_TYPES } from '../types/dnd';

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
  z-index: 100;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' 
        ? props.theme.colors.primaryHover 
        : props.theme.colors.background
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${props => props.theme.colors.background};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  overflow-y: auto;
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

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TemplateItem = styled.div<{ isActive: boolean }>`
  padding: 0.75rem;
  background: ${props => props.isActive ? props.theme.colors.primary : 'white'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    ${props => !props.isActive && `background-color: ${props.theme.colors.background};`}
  }
`;

const Canvas = styled.div<{ isPreviewMode: boolean }>`
  flex: 1;
  background: ${props => props.isPreviewMode ? props.theme.colors.background : 'white'};
  padding: 2rem;
  overflow-y: auto;
  transition: background-color 0.2s ease;
`;

const CanvasContent = styled.div<{ isEmpty: boolean }>`
  max-width: 800px;
  margin: 0 auto;
  min-height: ${props => props.isEmpty ? '600px' : 'auto'};
  
  ${props => props.isEmpty && `
    border: 2px dashed ${props.theme.colors.border};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props.theme.colors.textSecondary};
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

export const PortfolioBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, actions } = usePortfolioBuilder();
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Mock portfolio data for now - this will be replaced with API call
  useEffect(() => {
    if (id && !state.portfolio) {
      const mockPortfolio: Portfolio = {
        id: id,
        userId: 'user-1',
        title: 'My Portfolio',
        template: 'gallery',
        blocks: [],
        theme: 'default',
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      actions.setPortfolio(mockPortfolio);
    }
  }, [id, state.portfolio, actions]);

  const blockTypes: { type: BlockType; label: string }[] = [
    { type: 'title', label: 'Title' },
    { type: 'richtext', label: 'Rich Text' },
    { type: 'list', label: 'List' },
    { type: 'images', label: 'Images' },
    { type: 'resume', label: 'Resume' },
    { type: 'carousel', label: 'Carousel' },
    { type: 'divider', label: 'Divider' },
    { type: 'link', label: 'Link' }
  ];

  const templates = [
    { type: 'gallery' as const, label: 'Gallery' },
    { type: 'about' as const, label: 'About' },
    { type: 'contact' as const, label: 'Contact' }
  ];

  const handleDrop = (item: DragItem, dropIndex: number) => {
    if (item.type === DND_ITEM_TYPES.BLOCK_PALETTE) {
      // Add new block from palette
      actions.addBlock(item.blockType, dropIndex);
    } else if (item.type === DND_ITEM_TYPES.BLOCK_INSTANCE) {
      // Move existing block
      if (item.index !== dropIndex) {
        actions.moveBlock(item.block.id, dropIndex);
      }
    }
  };

  const handleBlockEdit = (block: any) => {
    actions.selectBlock(block);
    // TODO: Open block editor modal/panel
  };

  const handleBlockDelete = (blockId: string) => {
    actions.deleteBlock(blockId);
  };

  const handleTemplateChange = (templateType: any) => {
    actions.setTemplate(templateType);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving portfolio...', state.portfolio);
    actions.markClean();
  };

  const handlePreview = () => {
    actions.setPreviewMode(!state.isPreviewMode);
  };

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const handlePublishChange = (isPublished: boolean, publicUrl?: string) => {
    if (state.portfolio) {
      const updatedPortfolio = {
        ...state.portfolio,
        isPublished,
        publicUrl: publicUrl || state.portfolio.publicUrl,
      };
      actions.setPortfolio(updatedPortfolio);
    }
    setShowPublishModal(false);
  };

  if (!state.portfolio) {
    return <div>Loading...</div>;
  }

  const blocks = state.portfolio.blocks.sort((a, b) => a.position - b.position);
  const isEmpty = blocks.length === 0;

  return (
    <Container>
      <Header>
        <Title>
          {state.portfolio.title}
          {state.isDirty && ' *'}
        </Title>
        <HeaderActions>
          {state.isPreviewMode && (
            <ViewportSwitcher
              currentViewport={state.viewportMode}
              onViewportChange={actions.setViewportMode}
            />
          )}
          <Button onClick={handlePreview}>
            {state.isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={!state.isDirty}>
            Save Draft
          </Button>
          <Button variant="primary" onClick={handlePublish}>
            {state.portfolio.isPublished ? 'Manage Publishing' : 'Publish'}
          </Button>
        </HeaderActions>
      </Header>
      
      <EditorContainer>
        {!state.isPreviewMode && (
          <Sidebar>
            <SidebarSection>
              <SectionTitle>Blocks</SectionTitle>
              <BlockList>
                {blockTypes.map((block) => (
                  <DraggableBlockPalette
                    key={block.type}
                    blockType={block.type}
                    label={block.label}
                  />
                ))}
              </BlockList>
            </SidebarSection>
            
            <SidebarSection>
              <SectionTitle>Templates</SectionTitle>
              <TemplateList>
                {templates.map((template) => (
                  <TemplateItem
                    key={template.type}
                    isActive={state.portfolio?.template === template.type}
                    onClick={() => handleTemplateChange(template.type)}
                  >
                    {template.label}
                  </TemplateItem>
                ))}
              </TemplateList>
            </SidebarSection>
          </Sidebar>
        )}
        
        <Canvas isPreviewMode={state.isPreviewMode}>
          {state.isPreviewMode ? (
            <PreviewCanvas
              blocks={blocks}
              viewport={state.viewportMode}
              template={state.portfolio.template}
              isPreviewMode={state.isPreviewMode}
            />
          ) : (
            <CanvasContent isEmpty={isEmpty}>
              {isEmpty ? (
                <EmptyState>
                  <EmptyStateTitle>Start Building Your Portfolio</EmptyStateTitle>
                  <EmptyStateText>
                    Drag blocks from the sidebar to create your portfolio layout
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <>
                  <DropZone index={0} onDrop={handleDrop} />
                  {blocks.map((block, index) => (
                    <React.Fragment key={block.id}>
                      <DraggableBlockInstance
                        block={block}
                        index={index}
                        onEdit={handleBlockEdit}
                        onDelete={handleBlockDelete}
                      >
                        <BlockRenderer block={block} isEditing={!state.isPreviewMode} />
                      </DraggableBlockInstance>
                      <DropZone index={index + 1} onDrop={handleDrop} />
                    </React.Fragment>
                  ))}
                </>
              )}
            </CanvasContent>
          )}
        </Canvas>
      </EditorContainer>
      
      <PortfolioPublishModal
        portfolio={state.portfolio}
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublishChange={handlePublishChange}
      />
    </Container>
  );
};