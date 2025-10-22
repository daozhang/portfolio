import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CarouselData } from '../../types';

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

interface CarouselBlockProps {
  data: CarouselData;
  isEditing?: boolean;
  className?: string;
  mediaFiles?: MediaFile[];
}

const CarouselContainer = styled.div`
  margin: 1.5rem 0;
  position: relative;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: 300px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 250px;
  }
`;

const Slide = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 2rem;
  color: white;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const SlideTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.125rem;
  }
`;

const SlideDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.9;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.875rem;
  }
`;

const NavigationButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  
  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: translateY(-50%);
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 35px;
    height: 35px;
    ${props => props.direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
`;

const DotsContainer = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
`;

const Dot = styled.button<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? props.theme.colors.primaryHover : props.theme.colors.textSecondary};
    transform: scale(1.2);
  }
`;

const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: ${props => props.theme.colors.light};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const SlideCounter = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 2;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
  }
`;

export const CarouselBlock: React.FC<CarouselBlockProps> = ({ 
  data, 
  isEditing = false, 
  className,
  mediaFiles = [] 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState<MediaFile[]>([]);

  useEffect(() => {
    const filteredImages = mediaFiles.filter(file => 
      data.mediaFileIds.includes(file.id)
    );
    
    const sortedImages = data.mediaFileIds
      .map(id => filteredImages.find(file => file.id === id))
      .filter(Boolean) as MediaFile[];
    
    setImages(sortedImages);
    setCurrentSlide(0);
  }, [data.mediaFileIds, mediaFiles]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (data.autoPlay && images.length > 1 && !isEditing) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [data.autoPlay, images.length, isEditing, nextSlide]);

  if (data.mediaFileIds.length === 0) {
    return (
      <CarouselContainer className={className}>
        <PlaceholderContainer>
          {isEditing ? 'Click to add images to carousel' : 'No images to display'}
        </PlaceholderContainer>
      </CarouselContainer>
    );
  }

  if (images.length === 0) {
    return (
      <CarouselContainer className={className}>
        <PlaceholderContainer>
          Loading carousel images...
        </PlaceholderContainer>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer className={className}>
      <SlideContainer>
        {images.length > 1 && (
          <SlideCounter>
            {currentSlide + 1} / {images.length}
          </SlideCounter>
        )}
        
        {images.map((image, index) => (
          <Slide key={image.id} isActive={index === currentSlide}>
            <SlideImage
              src={image.urls.desktop}
              alt={image.projectDetails?.title || image.originalName}
            />
            {(image.projectDetails?.title || image.projectDetails?.description) && (
              <SlideOverlay>
                {image.projectDetails?.title && (
                  <SlideTitle>{image.projectDetails.title}</SlideTitle>
                )}
                {image.projectDetails?.description && (
                  <SlideDescription>{image.projectDetails.description}</SlideDescription>
                )}
              </SlideOverlay>
            )}
          </Slide>
        ))}
        
        {images.length > 1 && (
          <>
            <NavigationButton direction="prev" onClick={prevSlide}>
              ←
            </NavigationButton>
            <NavigationButton direction="next" onClick={nextSlide}>
              →
            </NavigationButton>
          </>
        )}
      </SlideContainer>
      
      {data.showDots && images.length > 1 && (
        <DotsContainer show={data.showDots}>
          {images.map((_, index) => (
            <Dot
              key={index}
              isActive={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
};