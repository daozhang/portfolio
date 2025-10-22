import React from 'react';
import styled from 'styled-components';
import { ListData } from '../../types/blocks';

interface ListBlockProps {
  data: ListData;
  isEditing?: boolean;
  className?: string;
}

const ListContainer = styled.div`
  margin: 1rem 0;
`;

const List = styled.ul<{ listType: string }>`
  margin: 0;
  padding-left: 2rem;
  list-style-type: ${props => props.listType === 'ordered' ? 'decimal' : 'disc'};
  color: ${props => props.theme.colors.text};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-left: 1.5rem;
  }
`;

const OrderedList = styled.ol`
  margin: 0;
  padding-left: 2rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-left: 1.5rem;
  }
`;

const ListItem = styled.li`
  margin: 0.5rem 0;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ListBlock: React.FC<ListBlockProps> = ({ 
  data, 
  className 
}) => {
  return (
    <ListContainer className={className}>
      {data.type === 'ordered' ? (
        <OrderedList>
          {data.items.map((item, index) => (
            <ListItem key={index}>
              {item}
            </ListItem>
          ))}
        </OrderedList>
      ) : (
        <List listType={data.type}>
          {data.items.map((item, index) => (
            <ListItem key={index}>
              {item}
            </ListItem>
          ))}
        </List>
      )}
    </ListContainer>
  );
};