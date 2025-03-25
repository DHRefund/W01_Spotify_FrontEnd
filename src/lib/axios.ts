import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Thêm interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Có thể thêm logic refresh token hoặc đăng xuất ở đây
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
