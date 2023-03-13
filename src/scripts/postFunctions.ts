import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { DATA_DIR, DATA_ENCODING, POSTS_DATA_PATH } from '../config';
import { NewPostInterface, PostInterface } from './interfaces';
import log from './log';

const postTemplate: NewPostInterface = {
  // id: 1,
  title: '',
  content: '',
  author: '',
  // publishTime: 0,
};

const idExists = (posts: PostInterface[], id: number): boolean =>
  posts.some((post) => post.id === id);

const getIndexByPostId = (posts: PostInterface[], id: number): number =>
  posts.findIndex((post) => post.id === id);

const findNewId = (posts: PostInterface[]): number => {
  if (posts.length === 0) return 1;
  let newId: number;
  let shift = 1;
  do {
    newId = posts[posts.length - shift].id + 1;
    shift++;
    if (shift > posts.length) return 1; // Never
  } while (idExists(posts, newId));
  return newId;
};

export const validatePost = (post: object): NewPostInterface | null => {
  const validPost: NewPostInterface = postTemplate;
  for (const field in postTemplate) {
    if (
      field in post &&
      typeof post[field as keyof object] === typeof postTemplate[field as keyof NewPostInterface]
    ) {
      validPost[field as keyof NewPostInterface] = post[field as keyof object];
    } else return null;
  }
  return validPost;
};

export const validatePostPartial = (postPartial: object): Partial<NewPostInterface> => {
  const validPostPartial: Partial<NewPostInterface> = {};
  for (const field in postPartial) {
    if (
      field in postTemplate &&
      typeof postPartial[field as keyof object] ===
        typeof postTemplate[field as keyof NewPostInterface]
    ) {
      validPostPartial[field as keyof NewPostInterface] = postPartial[field as keyof object];
    }
  }
  return validPostPartial;
};

export const addPost = async (newPost: NewPostInterface): Promise<boolean> => {
  try {
    let postsJson: string;
    if (existsSync(POSTS_DATA_PATH)) {
      postsJson = await readFile(POSTS_DATA_PATH, { encoding: DATA_ENCODING });
    } else {
      postsJson = '[]';
      if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR);
    }

    const posts: PostInterface[] = JSON.parse(postsJson);
    posts.push({
      ...newPost,
      id: findNewId(posts),
      publishTime: Date.now(),
    } as PostInterface);

    await writeFile(POSTS_DATA_PATH, JSON.stringify(posts), { encoding: DATA_ENCODING });
    return true;
  } catch (err) {
    log(`Unable to add post: ${(err as Error).message}\n${(err as Error).stack}`);
    return false;
  }
};

export const editPost = async (
  updatedFields: Partial<NewPostInterface>,
  editId: number
): Promise<boolean> => {
  try {
    if (!existsSync(POSTS_DATA_PATH)) {
      throw new Error(`Posts data file  at ${POSTS_DATA_PATH} does not exist`);
    }
    const postsJson: string = await readFile(POSTS_DATA_PATH, { encoding: DATA_ENCODING });

    const posts: PostInterface[] = JSON.parse(postsJson);
    const editIndex = getIndexByPostId(posts, editId);
    if (editIndex === -1) {
      throw new Error(`Post with id ${editId} does not exist`);
    }
    posts[editIndex] = { ...posts[editIndex], ...updatedFields, editTime: Date.now() };

    await writeFile(POSTS_DATA_PATH, JSON.stringify(posts), { encoding: DATA_ENCODING });
    return true;
  } catch (err) {
    log(`Unable to edit post: ${(err as Error).message}\n${(err as Error).stack}`);
    return false;
  }
};

export const deletePost = async (deleteId: number): Promise<boolean> => {
  try {
    if (!existsSync(POSTS_DATA_PATH)) {
      throw new Error(`Posts data file  at ${POSTS_DATA_PATH} does not exist`);
    }
    const postsJson: string = await readFile(POSTS_DATA_PATH, { encoding: DATA_ENCODING });

    let posts: PostInterface[] = JSON.parse(postsJson);
    posts = posts.filter((post) => post.id !== deleteId);

    await writeFile(POSTS_DATA_PATH, JSON.stringify(posts), { encoding: DATA_ENCODING });
    return true;
  } catch (err) {
    log(`Unable to delete post: ${(err as Error).message}\n${(err as Error).stack}`);
    return false;
  }
};
