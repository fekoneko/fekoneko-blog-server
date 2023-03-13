import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { POSTS_DATA_PATH } from '../config';
import { PostInterface } from '../scripts/interfaces';
import {
  addPost,
  deletePost,
  editPost,
  validatePost,
  validatePostPartial,
} from '../scripts/postFunctions';

export const handleGet = (req: Request, res: Response) => {
  if (existsSync(POSTS_DATA_PATH)) res.sendFile(POSTS_DATA_PATH);
  else res.status(200).json([]);
};

export const handlePost = async (req: Request, res: Response) => {
  const parsedPost: object = req.body;
  const validPost: PostInterface | null = validatePost(parsedPost, false);
  if (!validPost) {
    res.status(400).json({ error: 'Invalid post object' }); // Bad Request
    return;
  }
  if (!(await addPost(validPost))) {
    res.status(500).json({ error: 'Server error' }); // Internal Server Error
    return;
  }
  res.status(201).json(validPost); // Created
};

export const handlePatch = async (req: Request, res: Response) => {
  const editId: number = +req.params.id;
  if (isNaN(editId)) {
    res.status(400).json({ error: 'Incorrect ID' }); // Bad Request
    return;
  }
  const parsedUpdatedFields: object = req.body;
  const validUpdatedFields: Partial<PostInterface> = validatePostPartial(parsedUpdatedFields);
  if (!(await editPost(validUpdatedFields, editId))) {
    res.status(500).json({ error: 'Server error' }); // Internal Server Error
    return;
  }
  res.status(200).json(validUpdatedFields); // OK
};

export const handleDelete = async (req: Request, res: Response) => {
  const deleteId: number = +req.params.id;
  if (isNaN(deleteId)) {
    res.status(400).json({ error: 'Incorrect ID' }); // Bad Request
    return;
  }
  if (!(await deletePost(deleteId))) {
    res.status(500).json({ error: 'Server error' }); // Internal Server Error
    return;
  }
  res.status(204).end(); // No Content
};
