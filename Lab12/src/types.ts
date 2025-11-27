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

// Інтерфейс для представлення поста з API
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  image?: string;
  year?: number;
  genre?: string;
  rating?: {
    mean: number;
    count: number;
  };
}

// Тип для стану завантаження постів
export type PostsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Post[] }
  | { status: 'error'; message: string };


 //Інтерфейс для гри з GameBrain API (опціонально)
export interface Game {
  id: number;
  name: string;
  year: number;
  genre: string;
  image: string;
  link: string;
  short_description: string;
  rating: {
    mean: number;
    count: number;
  };
  adult_only: boolean;
  screenshots: string[];
  micro_trailer?: string;
  gameplay?: string;
  platforms: Array<{
    value: string;
    name: string;
  }>;
}
// Інтерфейс для відповіді від GameBrain API (опціонально)
export interface GameBrainResponse {
  query: string;
  total_results: number;
  limit: number;
  offset: number;
  results: Game[];
}
