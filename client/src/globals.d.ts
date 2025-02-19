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
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: { smallThumbnail: string; thumbnail: string };
  publishedDate: string;
  pageCount: number;
  categories: string[];
  averageRating: number | null;
  ratingsCount: number | null;
  isbn: string;
}
