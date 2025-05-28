export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Author {
  id: number;
  username: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
}

export interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  postId: number;
} 