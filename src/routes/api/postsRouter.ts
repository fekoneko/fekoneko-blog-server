import express from 'express';
import { existsSync } from 'fs';
import { POSTS_DATA_PATH } from '../../config';
import { PostInterface } from '../../interfaces';
import {
  addPost,
  deletePost,
  editPost,
  validatePost,
  validatePostPartial,
} from '../../postFunctions';

const postsRouter = express.Router();

postsRouter
  .route('/')

  .get((req, res) => {
    if (existsSync(POSTS_DATA_PATH)) res.sendFile(POSTS_DATA_PATH);
    else res.json([]);
  })

  .post(async (req, res) => {
    const parsedPost: object = req.body;
    const validPost: PostInterface | null = validatePost(parsedPost, false);
    if (!validPost) {
      res.statusCode = 400; // Bad Request
      res.json({ error: 'Invalid post object' });
      return;
    }
    if (!(await addPost(validPost))) {
      res.statusCode = 500; // Internal Server Error
      res.json({ error: 'Server error' });
      return;
    }
    res.statusCode = 201; // Created
    res.json(validPost);
  });

postsRouter
  .route('/:id')

  .patch(async (req, res) => {
    if (isNaN(+req.params.id)) {
      res.statusCode = 400; // Bad Request
      res.json({ error: 'Incorrect ID' });
      return;
    }
    const editId: number = +req.params.id;
    const parsedUpdatedFields: object = req.body;
    const updatedFields: Partial<PostInterface> = validatePostPartial(parsedUpdatedFields);
    if (!(await editPost(updatedFields, editId))) {
      res.statusCode = 500; // Internal Server Error
      res.json({ error: 'Server error' });
      return;
    }
    res.statusCode = 200; // OK
    res.json(updatedFields);
  })

  .delete(async (req, res) => {
    if (isNaN(+req.params.id)) {
      res.statusCode = 400; // Bad Request
      res.json({ error: 'Incorrect ID' });
      return;
    }
    const deleteId: number = +req.params.id;
    if (!(await deletePost(deleteId))) {
      res.statusCode = 500; // Internal Server Error
      res.json({ error: 'Server error' });
      return;
    }
    res.statusCode = 204; // No Content
    res.end();
  });

export default postsRouter;
