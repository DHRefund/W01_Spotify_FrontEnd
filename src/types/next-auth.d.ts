import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      imageUrl?: string;
      role?: string;
    };
  }
}
