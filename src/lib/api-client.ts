import Axios, { AxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";
import { clearSession } from "./auth-session";

export const axiosInstance = Axios.create({
  baseURL: "/",
});

/**
 * The token lives in an HttpOnly cookie — the browser sends it automatically
 * for every same-origin request, so no client-side token injection is needed.
 *
 * The proxy at /api/v1/* reads the cookie and adds Authorization: Bearer <token>
 * before forwarding the request to the external API.
 *
 * On a 401 response we clear the cookie and hard-navigate to /login.
 * The navigation resets the React tree, so AuthProvider re-initialises cleanly.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      await clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

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
