import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useMedia } from '../hooks/useMedia';
import { UploadMediaData } from '../services/mediaService';

interface MediaUploadProps {
  onUploadSuccess?: (mediaFile: any) => void;
  onUploadError?: (error: string) => void;
  showProjectDetails?: boolean;
  className?: string;
}

const DropZone = styled.div<{ isDragOver: boolean; hasError: boolean }>`
  border: 2px dashed ${props => 
    props.hasError ? props.theme.colors.danger : 
    props.isDragOver ? props.theme.colors.primary : 
    props.theme.colors.border
  };
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background-color: ${props => 
    props.isDragOver ? `${props.theme.colors.primary}10` : 
    props.theme.colors.background
  };
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}05;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMuted};
`;

const ProjectDetailsForm = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.light};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const TagsInput = styled(Input)`
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const UploadButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.danger}10;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.danger}30;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  showProjectDetails = true,
  className,
}) => {
  const { uploadMedia, loading, error } = useMedia();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectDetails, setProjectDetails] = useState<UploadMediaData>({
    title: '',
    description: '',
    tags: [],
    year: new Date().getFullYear(),
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setSelectedFile(imageFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const uploadData = showProjectDetails && projectDetails.title ? {
      title: projectDetails.title,
      description: projectDetails.description || undefined,
      tags: projectDetails.tags?.filter(tag => tag.trim()) || undefined,
      year: projectDetails.year || undefined,
    } : undefined;

    const result = await uploadMedia(selectedFile, uploadData);
    
    if (result) {
      onUploadSuccess?.(result);
      setSelectedFile(null);
      setProjectDetails({
        title: '',
        description: '',
        tags: [],
        year: new Date().getFullYear(),
      });
    } else if (error) {
      onUploadError?.(error);
    }
  }, [selectedFile, projectDetails, showProjectDetails, uploadMedia, onUploadSuccess, onUploadError, error]);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setProjectDetails(prev => ({ ...prev, tags }));
  }, []);

  const isValidFile = selectedFile && selectedFile.type.startsWith('image/');
  const canUpload = isValidFile && (!showProjectDetails || projectDetails.title);

  return (
    <div className={className}>
      <DropZone
        isDragOver={isDragOver}
        hasError={!!error}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <HiddenInput
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
        
        <UploadIcon>📁</UploadIcon>
        <UploadText>
          {selectedFile ? selectedFile.name : 'Drag and drop your image here'}
        </UploadText>
        <UploadSubtext>
          or click to browse • Supports JPEG, PNG, WebP • Max 10MB
        </UploadSubtext>
      </DropZone>

      {showProjectDetails && selectedFile && (
        <ProjectDetailsForm>
          <FormGroup>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              type="text"
              value={projectDetails.title}
              onChange={(e) => setProjectDetails(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter project title"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={projectDetails.description}
              onChange={(e) => setProjectDetails(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project..."
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput
              id="tags"
              type="text"
              value={projectDetails.tags?.join(', ') || ''}
              onChange={handleTagsChange}
              placeholder="design, illustration, branding (comma separated)"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 10}
              value={projectDetails.year}
              onChange={(e) => setProjectDetails(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            />
          </FormGroup>
        </ProjectDetailsForm>
      )}

      {selectedFile && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <UploadButton
            onClick={handleUpload}
            disabled={!canUpload || loading}
          >
            {loading && <LoadingSpinner />}
            {loading ? 'Uploading...' : 'Upload Image'}
          </UploadButton>
        </div>
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
};