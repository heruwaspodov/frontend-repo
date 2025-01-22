import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import store from "@/store";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/userSlice";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;
  private dispatch: AppDispatch;

  private constructor() {
    this.dispatch = store.dispatch;

    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const state: RootState = store.getState();
        const token = state.user.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.dispatch(logout());

          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(
        url,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || "An error occurred during the request"
      );
    }
    return new Error("An unexpected error occurred");
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const apiClient = ApiClient.getInstance();

export { apiClient, apiBaseUrl };
