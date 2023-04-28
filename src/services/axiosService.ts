import axios, { type AxiosResponse } from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export async function get<Type>(path: string): Promise<Type> {
  const result = await apiClient.get(`/${path}`);
  return generateResponse<Type>(result);
}

export async function post<Type>(path: string, body: any): Promise<Type> {
  const result = await apiClient.post(`/${path}`, body);
  return generateResponse<Type>(result);
}

export async function put<Type>(path: string, body: any): Promise<Type> {
  const result = await apiClient.put(`/${path}`, body);
  return generateResponse<Type>(result);
}

function generateResponse<Type>(axiosResult: AxiosResponse) {
  const resultPayload = axiosResult.data;

  if (resultPayload.errors !== null) {
    let errorMsg: string = '<ul>';

    for (let i = 0; i < resultPayload.errors.length; i++) {
      errorMsg += `<li>${resultPayload.errors[i]}</li>`;
    }

    errorMsg += '</ul>';

    throw new Error(errorMsg);
  }

  return resultPayload.data as Type;
}
