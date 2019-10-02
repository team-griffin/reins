import { ApiResponseError } from '../types';

export const is404 = (error: ApiResponseError) => {
  return error && error.response && error.response.status === 404;
};

export const isEmptyCommit = (error: string) => {
  return error && error.includes && error.includes('nothing to commit');
};
