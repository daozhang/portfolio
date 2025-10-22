import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useMedia } from '../hooks/useMedia';
import { MediaFile, MediaQueryParams } from '../services/mediaService';

interface MediaGalleryProps {
  portfolioId?: string;
  onMediaSelect?: (media: MediaFile) => void;
  onMediaDelete?: (mediaId: string) => void;
  selectable?: boolean;
  className?: string;
}

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const MediaCard = styled.div<{ selectable?: boolean }>`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  cursor: ${props => props.selectable ? 'pointer' : 'default'};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MediaCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin: 0 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: white;
  }

  &.delete {
    background: rgba(239, 68, 68, 0.9);
    color: white;

    &:hover {
      background: rgb(239, 68, 68);
    }
  }
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const ProjectTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ProjectDescription = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.light};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  portfolioId,
  onMediaSelect,
  onMediaDelete,
  selectable = false,
  className,
}) => {
  const { getMediaFiles, deleteMediaFile, loading } = useMedia();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const loadMediaFiles = useCallback(async (params?: MediaQueryParams) => {
    const result = await getMediaFiles({
      page: 1,
      limit: 12,
      portfolioId,
      ...params,
    });

    if (result) {
      setMediaFiles(result.files);
      setPagination(result.pagination);
    }
  }, [getMediaFiles, portfolioId]);

  useEffect(() => {
    loadMediaFiles();
  }, [loadMediaFiles]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    loadMediaFiles({ search: query, page: 1 });
  }, [loadMediaFiles]);

  const handlePageChange = useCallback((newPage: number) => {
    loadMediaFiles({ search: searchQuery, page: newPage });
  }, [loadMediaFiles, searchQuery]);

  const handleDelete = useCallback(async (mediaId: string) => {
    if (window.confirm('Are you sure you want to delete this media file?')) {
      const success = await deleteMediaFile(mediaId);
      if (success) {
        onMediaDelete?.(mediaId);
        loadMediaFiles({ search: searchQuery, page: pagination.page });
      }
    }
  }, [deleteMediaFile, onMediaDelete, loadMediaFiles, searchQuery, pagination.page]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && mediaFiles.length === 0) {
    return <LoadingMessage>Loading media files...</LoadingMessage>;
  }

  return (
    <GalleryContainer className={className}>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </SearchBar>

      {mediaFiles.length === 0 ? (
        <EmptyMessage>
          {searchQuery ? 'No media files found matching your search.' : 'No media files uploaded yet.'}
        </EmptyMessage>
      ) : (
        <>
          <Grid>
            {mediaFiles.map((media) => (
              <MediaCard
                key={media.id}
                selectable={selectable}
                onClick={() => selectable && onMediaSelect?.(media)}
              >
                <ImageContainer>
                  <Image
                    src={media.urls.thumbnail}
                    alt={media.projectDetails?.title || media.originalName}
                    loading="lazy"
                  />
                  <ImageOverlay>
                    {selectable && (
                      <ActionButton onClick={(e) => {
                        e.stopPropagation();
                        onMediaSelect?.(media);
                      }}>
                        Select
                      </ActionButton>
                    )}
                    <ActionButton
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(media.id);
                      }}
                    >
                      Delete
                    </ActionButton>
                  </ImageOverlay>
                </ImageContainer>

                <CardContent>
                  {media.projectDetails?.title && (
                    <ProjectTitle>{media.projectDetails.title}</ProjectTitle>
                  )}
                  
                  {media.projectDetails?.description && (
                    <ProjectDescription>{media.projectDetails.description}</ProjectDescription>
                  )}

                  {media.projectDetails?.tags && media.projectDetails.tags.length > 0 && (
                    <TagsContainer>
                      {media.projectDetails.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </TagsContainer>
                  )}

                  <MetaInfo>
                    <span>{formatFileSize(media.metadata.size)}</span>
                    <span>
                      {media.metadata.dimensions.width} × {media.metadata.dimensions.height}
                    </span>
                  </MetaInfo>
                </CardContent>
              </MediaCard>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </PaginationButton>
              
              <PageInfo>
                Page {pagination.page} of {pagination.totalPages}
              </PageInfo>
              
              <PaginationButton
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </GalleryContainer>
  );
};