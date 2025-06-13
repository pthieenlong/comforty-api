import dotenv from 'dotenv';
import path from 'path';

class ConfigModule {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const envFilePath = path.resolve(__dirname, `../../../.env.${env}`);
    dotenv.config({ path: envFilePath });
    console.log(`Environment loaded from: ${envFilePath}`);
  }

  get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value;
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error(`Config error: Env variable ${key} is not a number`);
    }
    return number;
  }

  getPort(): number {
    return Number(process.env['PORT']);
  }

  getRefreshToken(): string {
    const value = process.env["SECRET_REFRESH_TOKEN"];
    if (!value) {
      throw new Error(`Config error: SECRET_REFRESH_TOKEN is not defined`);
    }
    return value;
  }
  getAccessToken(): string {
    const value = process.env["SECRET_ACCESS_TOKEN"];
    if (!value) {
      throw new Error(`Config error: SECRET_ACCESS_TOKEN is not defined`);
    }
    return value;
  }
  getDatabaseUrl(): string {
    const value = process.env["DB_CONNECTION_STRING"];
    if (!value) {
      throw new Error(`Config error: DB_CONNECTION_STRING is not defined`);
    }
    return value;
  }
  getHttpSecure(): number {
    const value = this.get("IS_HTTP_SECURE");
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error(`Config error: Env variable IS_HTTP_SECURE is not a number`);
    }
    return number;
  }
}

export const configModule = new ConfigModule();
