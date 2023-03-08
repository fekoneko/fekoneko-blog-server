import express from 'express';
import dotenv from 'dotenv';
import log from './log';
import { PostInterface } from './interfaces';
import { addPost, deletePost, editPost, validatePost, validatePostPartial } from './postFunctions';
import { existsSync } from 'fs';
import { PORT, REACT_URL, POSTS_API, POSTS_DATA_PATH } from './config';

dotenv.config();

const app = express();

process.on('uncaughtException', (err) => {
  log(`Uncaught exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', REACT_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH,DELETE');
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

app.get(POSTS_API, (req, res) => {
  if (existsSync(POSTS_DATA_PATH)) res.sendFile(POSTS_DATA_PATH);
  else res.send('[]');
});

app.post(POSTS_API, async (req, res) => {
  const parsedPost: object = req.body;

  const validPost: PostInterface | null = validatePost(parsedPost, false);
  if (!validPost) {
    res.statusCode = 400; // Bad Request
    res.send('Invalid post object');
    return;
  }
  if (!(await addPost(validPost))) {
    res.statusCode = 500; // Internal Server Error
    res.send('Server error');
    return;
  }
  res.statusCode = 201; // Created
  res.send(JSON.stringify(validPost));
});

app.patch(`${POSTS_API}/:id`, async (req, res) => {
  // if (typeof +req.params.id !== 'number') {
  //   res.statusCode = 400; // Bad Request
  //   res.send('Incorrect ID');
  //   return;
  // }
  const editId: number = +req.params.id;
  const parsedUpdatedFields: object = req.body;
  const updatedFields: Partial<PostInterface> = validatePostPartial(parsedUpdatedFields);
  if (!(await editPost(updatedFields, editId))) {
    res.statusCode = 500; // Internal Server Error
    res.send('Server error');
    return;
  }
  res.statusCode = 200; // OK
  res.send(JSON.stringify(updatedFields));
});

app.delete(`${POSTS_API}/:id`, async (req, res) => {
  // if (typeof +req.params.id !== 'number') {
  //   res.statusCode = 400; // Bad Request
  //   res.send('Incorrect ID');
  //   return;
  // }
  const deleteId: number = +req.params.id;
  if (!(await deletePost(deleteId))) {
    res.statusCode = 500; // Internal Server Error
    res.send('Server error');
    return;
  }
  res.statusCode = 204; // No Content
  res.end();
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
