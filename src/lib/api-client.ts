import Axios, { AxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";

export const axiosInstance = Axios.create({
  baseURL: "/",
});

/**
 * Interceptor de request: injeta o JWT do localStorage (se existir).
 * Substitua pela fonte de token adequada (cookie, context, etc.).
 */
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Mutator gerado pelo Orval. Recebe a config do endpoint e as opções
 * extras passadas pelo hook, retorna apenas os dados da resposta.
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // Permite que o React Query cancele a request via AbortController
  (promise as Promise<T> & { cancel?: () => void }).cancel = () => {
    source.cancel("Request cancelled by React Query");
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
