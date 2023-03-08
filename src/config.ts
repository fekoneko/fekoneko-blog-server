import path from 'path';

export const PORT: number = +process.env.PORT! || 3500;
export const REACT_URL = 'http://localhost:5173';
export const POSTS_API = '/posts';
export const DATA_DIR = path.join(__dirname, '..', 'data');
export const POSTS_DATA_PATH = path.join(DATA_DIR, 'posts.json');
export const DATA_ENCODING = 'utf-8';
