import express from 'express';
import dotenv from 'dotenv';
import log from './log';
import { PostInterface } from './interfaces';
import { validatePost } from './postFunctions';
import { existsSync } from 'fs';
import { PORT, REACT_URL, POSTS_API, POSTS_DATA_PATH } from './config';

dotenv.config();

const app = express();

process.on('uncaughtException', (err) => {
  log(`Uncaught exception: ${err.message}`);
  process.exit(1);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', REACT_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((req, res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

app.get(POSTS_API, (req, res) => {
  if (existsSync(POSTS_DATA_PATH)) res.sendFile(POSTS_DATA_PATH);
  else res.send('[]');
});

app.post(POSTS_API, (req, res) => {
  let parsedPost: object;
  try {
    parsedPost = JSON.parse(req.body);
  } catch (err) {
    res.statusCode = 500; // Internal Server Error
    res.send('Invalid JSON');
    return;
  }
  const validPost: PostInterface | null = validatePost(parsedPost, false);
  if (validPost) {
    res.statusCode = 201; // Created
    res.send(JSON.stringify(validPost));
  } else {
    res.statusCode = 500; // Internal Server Error
    res.send('Invalid post object');
    return;
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
