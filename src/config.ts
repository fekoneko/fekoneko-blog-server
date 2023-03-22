import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = +process.env.PORT! || 3500;
export const ALLOWED_ORIGINS: string[] = (process.env.ALLOWED_ORIGINS &&
  JSON.parse(process.env.ALLOWED_ORIGINS)) || ['http://localhost:3000', 'http://127.0.0.1:3000'];
export const POSTS_API = '/posts';
export const DATA_DIR = path.join(__dirname, '..', 'model');
export const POSTS_DATA_PATH = path.join(DATA_DIR, 'posts.json');
export const DATA_ENCODING = 'utf-8';
