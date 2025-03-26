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

    // Log để debug
    console.log("Current session:", session);

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    } else {
      console.warn("No access token found in session");
    }

    // Đặc biệt quan trọng: Không ghi đè Content-Type cho FormData
    if (config.data instanceof FormData) {
      // Đảm bảo không ghi đè Content-Type cho FormData
      delete config.headers["Content-Type"];
    }

    console.log("Request config:", config);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  async (error) => {
    console.error("API Response Error:", error);
    if (error.response?.status === 401) {
      // Có thể thêm logic refresh token hoặc đăng xuất ở đây
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
