declare namespace NodeJS {
  export type ProcessEnv = {
    DB_URL: string;
    PORT: number;
    BCRYPT_SALT_ROUNDS: number;
    DEFAULT_PASS: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRES: string;
    JWT_REFRESH_TOKEN_EXPIRES: string;
    NODE_ENV: string;
  };
}
