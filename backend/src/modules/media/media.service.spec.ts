import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaFile } from '../../entities/media-file.entity';
import { FirebaseStorageService } from './firebase-storage.service';

describe('MediaService', () => {
  let service: MediaService;
  let mediaFileRepository: Repository<MediaFile>;
  let firebaseStorageService: FirebaseStorageService;

  const mockMediaFile = {
    id: '1',
    userId: 'user-1',
    portfolioId: null,
    originalName: 'test-image.jpg',
    urls: {
      original: 'https://example.com/original.jpg',
      thumbnail: 'https://example.com/thumbnail.jpg',
      mobile: 'https://example.com/mobile.jpg',
      desktop: 'https://example.com/desktop.jpg',
    },
    metadata: {
      size: 1024000,
      mimeType: 'image/jpeg',
      dimensions: { width: 1920, height: 1080 },
    },
    projectDetails: {
      title: 'Test Project',
      description: 'A test project',
      tags: ['design', 'test'],
      year: 2024,
    },
    createdAt: new Date(),
  };

  const mockMediaFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockFirebaseStorageService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(MediaFile),
          useValue: mockMediaFileRepository,
        },
        {
          provide: FirebaseStorageService,
          useValue: mockFirebaseStorageService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    mediaFileRepository = module.get<Repository<MediaFile>>(getRepositoryToken(MediaFile));
    firebaseStorageService = module.get<FirebaseStorageService>(FirebaseStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMediaFile', () => {
    it('should create a media file successfully', async () => {
      const createDto = {
        originalName: 'test-image.jpg',
        urls: mockMediaFile.urls,
        metadata: mockMediaFile.metadata,
        projectDetails: mockMediaFile.projectDetails,
      };

      mockMediaFileRepository.create.mockReturnValue(mockMediaFile);
      mockMediaFileRepository.save.mockResolvedValue(mockMediaFile);

      const result = await service.createMediaFile('user-1', createDto);

      expect(result).toEqual(mockMediaFile);
      expect(mockMediaFileRepository.create).toHaveBeenCalledWith({
        userId: 'user-1',
        ...createDto,
      });
      expect(mockMediaFileRepository.save).toHaveBeenCalledWith(mockMediaFile);
    });
  });

  describe('findByUserId', () => {
    it('should return media files for a user', async () => {
      const mediaFiles = [mockMediaFile];
      mockMediaFileRepository.find.mockResolvedValue(mediaFiles);

      const result = await service.findByUserId('user-1');

      expect(result).toEqual(mediaFiles);
      expect(mockMediaFileRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findById', () => {
    it('should return a media file by id', async () => {
      mockMediaFileRepository.findOne.mockResolvedValue(mockMediaFile);

      const result = await service.findById('1');

      expect(result).toEqual(mockMediaFile);
      expect(mockMediaFileRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if media file not found', async () => {
      mockMediaFileRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIdAndUserId', () => {
    it('should return a media file by id and userId', async () => {
      mockMediaFileRepository.findOne.mockResolvedValue(mockMediaFile);

      const result = await service.findByIdAndUserId('1', 'user-1');

      expect(result).toEqual(mockMediaFile);
      expect(mockMediaFileRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user-1' },
      });
    });

    it('should throw NotFoundException if media file not found', async () => {
      mockMediaFileRepository.findOne.mockResolvedValue(null);

      await expect(service.findByIdAndUserId('1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProjectDetails', () => {
    it('should update project details successfully', async () => {
      const updateDto = {
        title: 'Updated Project',
        description: 'Updated description',
        tags: ['updated', 'design'],
        year: 2024,
      };

      mockMediaFileRepository.findOne.mockResolvedValue(mockMediaFile);
      const updatedMediaFile = { ...mockMediaFile, projectDetails: updateDto };
      mockMediaFileRepository.save.mockResolvedValue(updatedMediaFile);

      const result = await service.updateProjectDetails('1', 'user-1', updateDto);

      expect(result.projectDetails).toEqual(updateDto);
      expect(mockMediaFileRepository.save).toHaveBeenCalled();
    });
  });

  describe('deleteMediaFile', () => {
    it('should delete media file successfully', async () => {
      mockMediaFileRepository.findOne.mockResolvedValue(mockMediaFile);
      mockFirebaseStorageService.deleteImage.mockResolvedValue(undefined);
      mockMediaFileRepository.remove.mockResolvedValue(mockMediaFile);

      await service.deleteMediaFile('1', 'user-1');

      expect(mockFirebaseStorageService.deleteImage).toHaveBeenCalledWith(mockMediaFile.urls);
      expect(mockMediaFileRepository.remove).toHaveBeenCalledWith(mockMediaFile);
    });
  });

  describe('assignToPortfolio', () => {
    it('should assign media file to portfolio', async () => {
      mockMediaFileRepository.findOne.mockResolvedValue(mockMediaFile);
      const assignedMediaFile = { ...mockMediaFile, portfolioId: 'portfolio-1' };
      mockMediaFileRepository.save.mockResolvedValue(assignedMediaFile);

      const result = await service.assignToPortfolio('1', 'user-1', 'portfolio-1');

      expect(result.portfolioId).toBe('portfolio-1');
      expect(mockMediaFileRepository.save).toHaveBeenCalled();
    });
  });

  describe('removeFromPortfolio', () => {
    it('should remove media file from portfolio', async () => {
      const mediaFileWithPortfolio = { ...mockMediaFile, portfolioId: 'portfolio-1' };
      mockMediaFileRepository.findOne.mockResolvedValue(mediaFileWithPortfolio);
      const removedMediaFile = { ...mediaFileWithPortfolio, portfolioId: null };
      mockMediaFileRepository.save.mockResolvedValue(removedMediaFile);

      const result = await service.removeFromPortfolio('1', 'user-1');

      expect(result.portfolioId).toBeNull();
      expect(mockMediaFileRepository.save).toHaveBeenCalled();
    });
  });
});