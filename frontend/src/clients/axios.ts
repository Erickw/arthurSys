import axios, { AxiosInstance } from 'axios';

export function getApiClient(token?: string): AxiosInstance {
  const api = axios.create({
    baseURL: 'https://us-central1-teste-869ba.cloudfunctions.net/api',
  });

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return api;
}
