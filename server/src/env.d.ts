declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    TIME: string;
    POSTGRES_USER: string;
    POSTGRES_PW: string;
  }
}
