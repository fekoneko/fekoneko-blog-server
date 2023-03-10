export interface PostInterface {
  id: number;
  title: string;
  content: string;
  author: string;
  publishTime: number;
  editTime?: number;
}

export interface NewPostInterface {
  title: string;
  content: string;
  author: string;
  publishTime?: number;
  editTime?: number;
}
