import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Block, Portfolio, TemplateType } from '../types/blocks';
import { createBlock, insertBlockAtPosition, removeBlock, moveBlock } from '../utils/blockUtils';

// Portfolio builder state
interface PortfolioBuilderState {
  portfolio: Portfolio | null;
  selectedBlock: Block | null;
  isPreviewMode: boolean;
  viewportMode: 'desktop' | 'mobile';
  isDirty: boolean;
}

// Portfolio builder actions
type PortfolioBuilderAction =
  | { type: 'SET_PORTFOLIO'; payload: Portfolio }
  | { type: 'ADD_BLOCK'; payload: { blockType: string; position: number } }
  | { type: 'UPDATE_BLOCK'; payload: { blockId: string; data: any } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'MOVE_BLOCK'; payload: { blockId: string; newPosition: number } }
  | { type: 'SELECT_BLOCK'; payload: Block | null }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_VIEWPORT_MODE'; payload: 'desktop' | 'mobile' }
  | { type: 'SET_TEMPLATE'; payload: TemplateType }
  | { type: 'MARK_CLEAN' }
  | { type: 'MARK_DIRTY' };

// Initial state
const initialState: PortfolioBuilderState = {
  portfolio: null,
  selectedBlock: null,
  isPreviewMode: false,
  viewportMode: 'desktop',
  isDirty: false,
};

// Reducer
const portfolioBuilderReducer = (
  state: PortfolioBuilderState,
  action: PortfolioBuilderAction
): PortfolioBuilderState => {
  switch (action.type) {
    case 'SET_PORTFOLIO':
      return {
        ...state,
        portfolio: action.payload,
        isDirty: false,
      };

    case 'ADD_BLOCK':
      if (!state.portfolio) return state;
      
      const newBlock = createBlock(action.payload.blockType as any, action.payload.position);
      const updatedBlocks = insertBlockAtPosition(
        state.portfolio.blocks,
        newBlock,
        action.payload.position
      );
      
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          blocks: updatedBlocks,
        },
        isDirty: true,
      };

    case 'UPDATE_BLOCK':
      if (!state.portfolio) return state;
      
      const updatedBlocksForUpdate = state.portfolio.blocks.map(block =>
        block.id === action.payload.blockId
          ? { ...block, data: action.payload.data }
          : block
      );
      
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          blocks: updatedBlocksForUpdate,
        },
        isDirty: true,
      };

    case 'DELETE_BLOCK':
      if (!state.portfolio) return state;
      
      const blocksAfterDelete = removeBlock(state.portfolio.blocks, action.payload);
      
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          blocks: blocksAfterDelete,
        },
        selectedBlock: state.selectedBlock?.id === action.payload ? null : state.selectedBlock,
        isDirty: true,
      };

    case 'MOVE_BLOCK':
      if (!state.portfolio) return state;
      
      const blocksAfterMove = moveBlock(
        state.portfolio.blocks,
        action.payload.blockId,
        action.payload.newPosition
      );
      
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          blocks: blocksAfterMove,
        },
        isDirty: true,
      };

    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlock: action.payload,
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
      };

    case 'SET_VIEWPORT_MODE':
      return {
        ...state,
        viewportMode: action.payload,
      };

    case 'SET_TEMPLATE':
      if (!state.portfolio) return state;
      
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          template: action.payload,
        },
        isDirty: true,
      };

    case 'MARK_CLEAN':
      return {
        ...state,
        isDirty: false,
      };

    case 'MARK_DIRTY':
      return {
        ...state,
        isDirty: true,
      };

    default:
      return state;
  }
};

// Context
interface PortfolioBuilderContextType {
  state: PortfolioBuilderState;
  actions: {
    setPortfolio: (portfolio: Portfolio) => void;
    addBlock: (blockType: string, position: number) => void;
    updateBlock: (blockId: string, data: any) => void;
    deleteBlock: (blockId: string) => void;
    moveBlock: (blockId: string, newPosition: number) => void;
    selectBlock: (block: Block | null) => void;
    setPreviewMode: (isPreview: boolean) => void;
    setViewportMode: (mode: 'desktop' | 'mobile') => void;
    setTemplate: (template: TemplateType) => void;
    markClean: () => void;
    markDirty: () => void;
  };
}

const PortfolioBuilderContext = createContext<PortfolioBuilderContextType | undefined>(undefined);

// Provider
interface PortfolioBuilderProviderProps {
  children: ReactNode;
}

export const PortfolioBuilderProvider: React.FC<PortfolioBuilderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(portfolioBuilderReducer, initialState);

  const actions = {
    setPortfolio: (portfolio: Portfolio) => 
      dispatch({ type: 'SET_PORTFOLIO', payload: portfolio }),
    
    addBlock: (blockType: string, position: number) => 
      dispatch({ type: 'ADD_BLOCK', payload: { blockType, position } }),
    
    updateBlock: (blockId: string, data: any) => 
      dispatch({ type: 'UPDATE_BLOCK', payload: { blockId, data } }),
    
    deleteBlock: (blockId: string) => 
      dispatch({ type: 'DELETE_BLOCK', payload: blockId }),
    
    moveBlock: (blockId: string, newPosition: number) => 
      dispatch({ type: 'MOVE_BLOCK', payload: { blockId, newPosition } }),
    
    selectBlock: (block: Block | null) => 
      dispatch({ type: 'SELECT_BLOCK', payload: block }),
    
    setPreviewMode: (isPreview: boolean) => 
      dispatch({ type: 'SET_PREVIEW_MODE', payload: isPreview }),
    
    setViewportMode: (mode: 'desktop' | 'mobile') => 
      dispatch({ type: 'SET_VIEWPORT_MODE', payload: mode }),
    
    setTemplate: (template: TemplateType) => 
      dispatch({ type: 'SET_TEMPLATE', payload: template }),
    
    markClean: () => 
      dispatch({ type: 'MARK_CLEAN' }),
    
    markDirty: () => 
      dispatch({ type: 'MARK_DIRTY' }),
  };

  return (
    <PortfolioBuilderContext.Provider value={{ state, actions }}>
      {children}
    </PortfolioBuilderContext.Provider>
  );
};

// Hook
export const usePortfolioBuilder = (): PortfolioBuilderContextType => {
  const context = useContext(PortfolioBuilderContext);
  if (!context) {
    throw new Error('usePortfolioBuilder must be used within a PortfolioBuilderProvider');
  }
  return context;
};