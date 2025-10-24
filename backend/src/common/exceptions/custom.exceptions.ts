import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

export class InvalidInviteCodeException extends BadRequestException {
  constructor() {
    super('Invalid or expired invite code');
  }
}

export class InviteCodeAlreadyUsedException extends ConflictException {
  constructor() {
    super('Invite code has already been used');
  }
}

export class PortfolioNotFoundException extends NotFoundException {
  constructor(portfolioId: string) {
    super(`Portfolio with ID ${portfolioId} not found`);
  }
}

export class MediaFileNotFoundException extends NotFoundException {
  constructor(fileId: string) {
    super(`Media file with ID ${fileId} not found`);
  }
}

export class UnauthorizedAccessException extends UnauthorizedException {
  constructor(resource?: string) {
    super(resource ? `Unauthorized access to ${resource}` : 'Unauthorized access');
  }
}

export class InsufficientPermissionsException extends ForbiddenException {
  constructor(action?: string) {
    super(action ? `Insufficient permissions to ${action}` : 'Insufficient permissions');
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`);
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid email or password');
  }
}

export class FileUploadException extends BadRequestException {
  constructor(message: string) {
    super(`File upload failed: ${message}`);
  }
}

export class InvalidFileTypeException extends BadRequestException {
  constructor(allowedTypes: string[]) {
    super(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
}

export class FileSizeExceededException extends BadRequestException {
  constructor(maxSize: string) {
    super(`File size exceeds maximum allowed size of ${maxSize}`);
  }
}