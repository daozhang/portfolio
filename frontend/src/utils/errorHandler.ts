import { AxiosError } from 'axios';

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  method: string;
  errors?: Record<string, string[]>;
}

export interface UserFriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export class ErrorHandler {
  static handleApiError(error: unknown): UserFriendlyError {
    if (this.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }
    
    if (error instanceof Error) {
      return this.handleGenericError(error);
    }
    
    return this.handleUnknownError();
  }

  private static isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError)?.isAxiosError === true;
  }

  private static handleAxiosError(error: AxiosError<ApiError>): UserFriendlyError {
    const { response, request } = error;
    
    if (response) {
      return this.handleResponseError(response.status, response.data);
    }
    
    if (request) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        type: 'error',
      };
    }
    
    return this.handleGenericError(error);
  }

  private static handleResponseError(status: number, data?: ApiError): UserFriendlyError {
    switch (status) {
      case 400:
        return this.handleBadRequest(data);
      case 401:
        return {
          title: 'Authentication Required',
          message: 'Please log in to continue.',
          type: 'warning',
        };
      case 403:
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          type: 'error',
        };
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource could not be found.',
          type: 'error',
        };
      case 409:
        return {
          title: 'Conflict',
          message: data?.message || 'A conflict occurred while processing your request.',
          type: 'warning',
        };
      case 422:
        return this.handleValidationError(data);
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'You\'re making requests too quickly. Please wait a moment and try again.',
          type: 'warning',
        };
      case 500:
        return {
          title: 'Server Error',
          message: 'An internal server error occurred. Please try again later.',
          type: 'error',
        };
      case 502:
      case 503:
      case 504:
        return {
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
          type: 'error',
        };
      default:
        return {
          title: 'Request Failed',
          message: data?.message || `Request failed with status ${status}`,
          type: 'error',
        };
    }
  }

  private static handleBadRequest(data?: ApiError): UserFriendlyError {
    if (data?.errors) {
      const validationMessages = Object.entries(data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      
      return {
        title: 'Validation Error',
        message: validationMessages,
        type: 'warning',
      };
    }
    
    return {
      title: 'Invalid Request',
      message: data?.message || 'The request contains invalid data.',
      type: 'warning',
    };
  }

  private static handleValidationError(data?: ApiError): UserFriendlyError {
    if (data?.errors) {
      const errorCount = Object.keys(data.errors).length;
      const firstError = Object.values(data.errors)[0]?.[0];
      
      return {
        title: 'Validation Failed',
        message: errorCount > 1 
          ? `${errorCount} validation errors occurred. ${firstError}`
          : firstError || 'Please check your input and try again.',
        type: 'warning',
      };
    }
    
    return {
      title: 'Validation Failed',
      message: data?.message || 'Please check your input and try again.',
      type: 'warning',
    };
  }

  private static handleGenericError(error: Error): UserFriendlyError {
    return {
      title: 'Unexpected Error',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred. Please try again.',
      type: 'error',
    };
  }

  private static handleUnknownError(): UserFriendlyError {
    return {
      title: 'Unknown Error',
      message: 'An unknown error occurred. Please try again.',
      type: 'error',
    };
  }

  // Specific error handlers for common scenarios
  static handleAuthError(): UserFriendlyError {
    return {
      title: 'Authentication Failed',
      message: 'Invalid email or password. Please try again.',
      type: 'error',
    };
  }

  static handleFileUploadError(error: unknown): UserFriendlyError {
    const baseError = this.handleApiError(error);
    
    if (baseError.message.includes('file size')) {
      return {
        title: 'File Too Large',
        message: 'The selected file is too large. Please choose a smaller file.',
        type: 'warning',
      };
    }
    
    if (baseError.message.includes('file type')) {
      return {
        title: 'Invalid File Type',
        message: 'Please select a valid image file (JPEG, PNG, or WebP).',
        type: 'warning',
      };
    }
    
    return {
      title: 'Upload Failed',
      message: 'Failed to upload the file. Please try again.',
      type: 'error',
    };
  }

  static handleNetworkError(): UserFriendlyError {
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'error',
    };
  }
}

// Utility function to log errors in development
export const logError = (error: unknown, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }
};