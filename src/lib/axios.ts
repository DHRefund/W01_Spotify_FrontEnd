"use client";

import axios from "axios";
import { Session } from "next-auth";
import { useSession, getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// let session = useSession();

// cache session
// Biến để cache session
let cachedSession: Session | null = null;
let sessionExpiry = 0;
const SESSION_CACHE_TIME = 5 * 60 * 1000; // 5 phút
// Hàm lấy session với cache
const getSessionCached = async () => {
  const now = Date.now();
  console.log("call getSessionCached");

  // Nếu có session trong cache và chưa hết hạn, trả về session đó
  if (cachedSession && now < sessionExpiry) {
    return cachedSession;
  }

  // Nếu không có hoặc đã hết hạn, lấy session mới
  const newSession = await getSession();
  cachedSession = newSession;
  sessionExpiry = now + SESSION_CACHE_TIME;

  return newSession;
};
// Prefetch session - gọi hàm này khi ứng dụng khởi động
export const prefetchSession = async () => {
  return await getSessionCached();
};

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // Thêm interceptor để tự động gắn token vào header
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const session = await getSessionCached();

//     // Log để debug
//     console.log("Current session:", session);

//     if (session?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.accessToken}`;
//     } else {
//       console.warn("No access token found in session");
//     }

//     // Đặc biệt quan trọng: Không ghi đè Content-Type cho FormData
//     if (config.data instanceof FormData) {
//       // Đảm bảo không ghi đè Content-Type cho FormData
//       delete config.headers["Content-Type"];
//     }

//     console.log("Request config:", config);
//     return config;
//   },
//   (error) => {
//     console.error("API Request Error:", error);
//     return Promise.reject(error);
//   }
// );

// // Thêm interceptor để xử lý lỗi 401 (Unauthorized)
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("API Response:", response);
//     return response;
//   },
//   async (error) => {
//     console.error("API Response Error:", error);
//     if (error.response?.status === 401) {
//       // Có thể thêm logic refresh token hoặc đăng xuất ở đây
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// Tạo một phiên bản axios mới có thể nhận token

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const createAuthenticatedApi = (accessToken?: string) => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    withCredentials: true,
  });

  // Xử lý FormData
  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  });

  // Xử lý lỗi 401
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
