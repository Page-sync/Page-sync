export interface User {
  userId: number;
  userName: string;
}
export interface NoteCard {
  page: number;
  index: number;
  content: string;
  author: User;
}

export interface BookInfo {
  link: string;
  author: string | null;
  coverImg: string | null;
}
