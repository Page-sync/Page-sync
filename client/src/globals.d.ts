export interface User {
  userid: string;
  email: string;
}
export interface NoteInfo {
  id: number;
  userid: string;
  page: number;
  isbn: string;
  title: string | null;
  content: string;
}
export interface History {
  id: number;
  page: number;
  isbn: string;
  create_at: string | null;
  update_at: string | null;
  userid: string;
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
