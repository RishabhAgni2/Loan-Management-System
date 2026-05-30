import { AxiosError } from 'axios';

interface ErrorBody {
  message?: string;
  errors?: string[];
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ErrorBody>;
  return axiosError.response?.data?.message || fallback;
};

export const getApiErrorMessages = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ErrorBody>;
  return axiosError.response?.data?.errors || [axiosError.response?.data?.message || fallback];
};
