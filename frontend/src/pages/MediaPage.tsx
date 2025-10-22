import React from 'react';
import styled from 'styled-components';
import { Layout, MediaManager } from '../components';
import { MediaFile } from '../services/mediaService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
`;

const MediaPage: React.FC = () => {
  const handleMediaSelect = (media: MediaFile) => {
    console.log('Selected media:', media);
    // Handle media selection (e.g., for portfolio builder)
  };

  return (
    <Layout>
      <Container>
        <Title>Media Management</Title>
        <MediaManager
          showUpload={true}
          showProjectDetails={true}
          selectable={false}
          onMediaSelect={handleMediaSelect}
        />
      </Container>
    </Layout>
  );
};

export default MediaPage;