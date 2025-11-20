// Інтерфейс для представлення статті/поста
export interface Article {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string; // формат YYYY-MM-DD
  content: string;
  tags: string[];
  image?: string; // опціональне поле для шляху до зображення
}