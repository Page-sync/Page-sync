export interface User {
  userId: number;
  userName: string;
}
export interface NoteInfo {
  page: number;
  index: number;
  content: string;
  author: User;
}

export interface BookInfo {
  id: number;
  title: string;
  url: string;
  // author: string | null;
  // coverImg: string | null;
}
