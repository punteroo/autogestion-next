import 'next-auth';

declare module "next-auth" {
  interface Session {
    refreshTokenExpires?: number;
    accessTokenExpires?: string;
    refreshToken?: string;
    token?: string;
    error?: string;
    user?: User;
  }

  interface User {
    academicId: number;
    firstName: string;
    lastName: string;
    dni: number;
    hash: string;
    career: {
      id: number;
      code: number;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    refreshTokenExpires?: number;
    accessTokenExpires?: number;
    refreshToken?: string;
    token: string;
    exp?: number;
    iat?: number;
    jti?: string;
  }
}
