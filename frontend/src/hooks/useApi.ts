import { useState, useCallback } from 'react'; // Import useCallback

// This hook will handle all network requests
export const useApi = <TData, TError = string>() => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<TError | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const executeRequest = useCallback(async <TBody = unknown>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: TBody
  ): Promise<TData | null> => {
    if (!API_URL) {
      setError('API URL is not configured.' as TError);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message as TError);
      } else {
        setError('An unknown error occurred.' as TError);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL, setData, setLoading, setError]); 

  return {
    data,
    loading,
    error,
    executeRequest,
  };
};