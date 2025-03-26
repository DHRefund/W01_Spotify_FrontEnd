import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import api from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await api.post("/auth/login", credentials);
          console.log("Auth response from backend:", response.data);
          return response.data;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback - Received user:", user);
      console.log("JWT Callback - Current token:", token);
      console.log("JWT Callback - Received account:", account);
      console.log("JWT Callback - Received profile:", profile);

      if (user) {
        // Đảm bảo lưu đúng thông tin từ response login
        return {
          ...token,
          accessToken: user.access_token,
          role: user.user.role, // Lấy role từ user object
          user: user.user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Initial session:", session);

      // Cập nhật session với thông tin từ token
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          ...token.user,
          role: token.role,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Thêm debug mode để xem logs chi tiết hơn
});

export { handler as GET, handler as POST };
