import type { Post, GameBrainResponse, Game } from './types.js';

const API_URL = 'https://api.gamebrain.co/v1/games';
const API_KEY = 'cf6dce00bffb47ecaf490ea3f6cecb1b';

/**
 * Завантажує пости (ігри) з GameBrain API за заданим запитом.
 * @param query - пошуковий запит (наприклад, "medieval strategy games")
 * @param limit - максимальна кількість результатів
 * @returns Promise з масивом постів
 */
export async function fetchPosts(query: string = 'medieval strategy games', limit: number = 10): Promise<Post[]> {
  try {
    const url = `${API_URL}?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

 const data: GameBrainResponse = await response.json();
    
 // Перевіряємо, чи є results у відповіді
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Невірний формат відповіді від API');
    }
    
    // Перетворюємо дані з GameBrain API у формат Post
    const posts: Post[] = data.results.slice(0, limit).map((game: Game) => ({
      userId: 1, // Фіктивне значення
      id: game.id,
      title: game.name,
      body: game.short_description || `${game.genre} гра випущена у ${game.year} році`,
      image: game.image,
      year: game.year,
      genre: game.genre,
      rating: game.rating
    }));

    return posts;
  } catch (error) {
    console.error('Не вдалося завантажити пости:', error);
    throw error;
  }
}

/**
// Альтернативна функція для використання JSONPlaceholder API (для тестування без API ключа)
export async function fetchPostsPlaceholder(limit: number = 10): Promise<Post[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data: Post[] = await response.json();
    return data.slice(0, limit);
  } catch (error) {
    console.error('Не вдалося завантажити пости:', error);
    throw error;
  }
}
  */