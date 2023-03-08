import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { DATA_DIR, DATA_ENCODING, POSTS_DATA_PATH } from './config';
import { PostInterface } from './interfaces';
import log from './log';

const postTemplate: PostInterface = {
  // id: 1,
  title: '',
  content: '',
  author: '',
  publishTime: 0,
};

const findPostById = (
  posts: Array<Required<PostInterface>>,
  id: number
): Required<PostInterface> | undefined => posts.find((post) => post.id === id);

const findNewId = (posts: Array<Required<PostInterface>>): number => {
  if (posts.length === 0) return 1;
  let newId: number;
  do {
    newId = posts[posts.length - 1].id + 1;
    delete posts[posts.length - 1];
  } while (findPostById(posts, newId));
  return newId;
};

export const validatePost = (post: object, includeId: boolean): PostInterface | null => {
  const validPost: PostInterface = postTemplate;
  for (const field in postTemplate) {
    const element = postTemplate[field as keyof PostInterface];
    if (
      field in post &&
      typeof post[field as keyof object] === typeof postTemplate[field as keyof PostInterface]
    ) {
      validPost[field as keyof PostInterface] = post[field as keyof object];
    } else return null;
  }
  if (includeId) {
    if ('id' in post && typeof post.id === 'number' && post.id >= 1) {
      validPost.id = post.id;
    } else return null;
  }
  return validPost;
};

export const addPost = async (newPost: PostInterface): Promise<void> => {
  try {
    let postsJson: string;
    if (existsSync(POSTS_DATA_PATH)) {
      postsJson = await readFile(POSTS_DATA_PATH, { encoding: DATA_ENCODING });
    } else {
      postsJson = '[]';
      if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR);
    }
    const posts: Array<Required<PostInterface>> = JSON.parse(postsJson);
    newPost.id = findNewId(posts);
    posts.push(newPost as Required<PostInterface>);
    await writeFile(POSTS_DATA_PATH, JSON.stringify(posts));
  } catch (err) {
    log(`Unable to add post: ${(err as Error).message}`);
  }
};
