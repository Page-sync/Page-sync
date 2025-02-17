export interface User {
  userId: number;
  userName: string;
}
export interface NoteInfo {
  id: number;
  page: number;
  content: string;
  author: User;
}

export interface BookInfo {
  id: number;
  title: string;
  url: string;
  cover: string;
  author: string;
  // author: string | null;
  // coverImg: string | null;
}
