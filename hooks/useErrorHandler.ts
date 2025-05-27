import { useState, useCallback } from 'react';
import { ApiError, ApiErrorType } from '../services/apiService';

interface ErrorState {
  error: string | null;
  type: ApiErrorType | null;
  isRetryable: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    type: null,
    isRetryable: false,
  });

  const handleError = useCallback((error: any) => {
    let apiError: ApiError;

    // If it's already an ApiError, use it directly
    if (error.type && error.message) {
      apiError = error as ApiError;
    } else {
      // Convert regular errors to ApiError
      apiError = {
        type: ApiErrorType.UNKNOWN,
        message: error.message || 'An unexpected error occurred',
        originalError: error,
      };
    }

    const isRetryable = [
      ApiErrorType.NETWORK_ERROR,
      ApiErrorType.TIMEOUT,
      ApiErrorType.SERVER_ERROR,
    ].includes(apiError.type);

    setErrorState({
      error: apiError.message,
      type: apiError.type,
      isRetryable,
    });

    return apiError;
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      type: null,
      isRetryable: false,
    });
  }, []);

  const getErrorComponent = useCallback((onRetry?: () => void) => {
    if (!errorState.error) return null;

    const getErrorType = () => {
      switch (errorState.type) {
        case ApiErrorType.NETWORK_ERROR:
          return 'network';
        case ApiErrorType.SERVER_ERROR:
          return 'server';
        default:
          return 'general';
      }
    };

    return {
      message: errorState.error,
      type: getErrorType(),
      onRetry: errorState.isRetryable ? onRetry : undefined,
    };
  }, [errorState]);

  return {
    errorState,
    handleError,
    clearError,
    getErrorComponent,
  };
}