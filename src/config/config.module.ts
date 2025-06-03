import dotenv from 'dotenv';
import path from 'path';

class ConfigModule {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const envFilePath = path.resolve(__dirname, `../../.env.${env}`);
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
}

export const configModule = new ConfigModule();
