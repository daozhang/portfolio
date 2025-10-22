import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ImagesData } from '../../types';

interface MediaFile {
  id: string;
  urls: {
    original: string;
    thumbnail: string;
    mobile: string;
    desktop: string;
  };
  originalName: string;
  projectDetails?: {
    title?: string;
    description?: string;
  };
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
  };
}

interface ImagesBlockProps {
  data: ImagesData;
  isEditing?: boolean;
  className?: string;
  mediaFiles?: MediaFile[]; // In a real app, this would come from a context or service
}

const ImagesContainer = styled.div`
  margin: 1.5rem 0;
`;

const GridLayout = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(${props => Math.min(props.columns, 2)}, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const MasonryLayout = styled.div`
  columns: ${props => props.theme.breakpoints.desktop} 300px;
  column-gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    columns: 2;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    columns: 1;
  }
`;

const SingleLayout = styled.div`
  display: flex;
  justify-content: center;
`;

const ImageWrapper = styled.div<{ layout: string }>`
  position: relative;
  overflow: hidden;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.light};
  
  ${props => props.layout === 'masonry' && `
    break-inside: avoid;
    margin-bottom: 1rem;
  `}
  
  &:hover .image-overlay {
    opacity: 1;
  }
`;

const Image = styled.img<{ layout: string }>`
  width: 100%;
  height: ${props => props.layout === 'grid' ? '250px' : 'auto'};
  object-fit: ${props => props.layout === 'grid' ? 'cover' : 'contain'};
  display: block;
  transition: transform 0.3s ease;
  
  ${props => props.layout === 'single' && `
    max-height: 600px;
  `}
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
`;

const ImageInfo = styled.div`
  color: white;
  width: 100%;
`;

const ImageTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
`;

const ImageDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.4;
`;

const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: ${props => props.theme.colors.light};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 2rem;
`;

const PlaceholderText = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

export const ImagesBlock: React.FC<ImagesBlockProps> = ({ 
  data, 
  isEditing = false, 
  className,
  mediaFiles = [] 
}) => {
  const [images, setImages] = useState<MediaFile[]>([]);

  useEffect(() => {
    // Filter media files based on the IDs in data.mediaFileIds
    const filteredImages = mediaFiles.filter(file => 
      data.mediaFileIds.includes(file.id)
    );
    
    // Sort images to match the order in data.mediaFileIds
    const sortedImages = data.mediaFileIds
      .map(id => filteredImages.find(file => file.id === id))
      .filter(Boolean) as MediaFile[];
    
    setImages(sortedImages);
  }, [data.mediaFileIds, mediaFiles]);

  if (data.mediaFileIds.length === 0) {
    return (
      <ImagesContainer className={className}>
        <PlaceholderContainer>
          <PlaceholderText>
            {isEditing ? 'Click to add images' : 'No images to display'}
          </PlaceholderText>
        </PlaceholderContainer>
      </ImagesContainer>
    );
  }

  if (images.length === 0) {
    return (
      <ImagesContainer className={className}>
        <PlaceholderContainer>
          <PlaceholderText>Loading images...</PlaceholderText>
        </PlaceholderContainer>
      </ImagesContainer>
    );
  }

  const renderImages = () => {
    const imageElements = images.map((image, index) => (
      <ImageWrapper key={image.id} layout={data.layout}>
        <Image
          src={image.urls.desktop}
          alt={image.projectDetails?.title || image.originalName}
          layout={data.layout}
          loading="lazy"
        />
        {(image.projectDetails?.title || image.projectDetails?.description) && (
          <ImageOverlay className="image-overlay">
            <ImageInfo>
              {image.projectDetails?.title && (
                <ImageTitle>{image.projectDetails.title}</ImageTitle>
              )}
              {image.projectDetails?.description && (
                <ImageDescription>{image.projectDetails.description}</ImageDescription>
              )}
            </ImageInfo>
          </ImageOverlay>
        )}
      </ImageWrapper>
    ));

    switch (data.layout) {
      case 'grid':
        return (
          <GridLayout columns={data.columns || 2}>
            {imageElements}
          </GridLayout>
        );
      
      case 'masonry':
        return (
          <MasonryLayout>
            {imageElements}
          </MasonryLayout>
        );
      
      case 'single':
        return (
          <SingleLayout>
            {imageElements[0]} {/* Only show first image in single layout */}
          </SingleLayout>
        );
      
      default:
        return (
          <GridLayout columns={data.columns || 2}>
            {imageElements}
          </GridLayout>
        );
    }
  };

  return (
    <ImagesContainer className={className}>
      {renderImages()}
    </ImagesContainer>
  );
};