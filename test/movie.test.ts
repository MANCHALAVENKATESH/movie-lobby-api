import Movie, { IMovie } from '../src/models/movie';

describe('Movie Model Test', () => {
  it('should create a movie with required fields', () => {
    const movie: IMovie = new Movie({
      title: 'Test Movie',
      genre: 'Test Genre',
      rating: 5,
      streamingLink: 'http://example.com',
    });
    expect(movie.title).toBe('Test Movie');
    expect(movie.genre).toBe('Test Genre');
    expect(movie.rating).toBe(5);
    expect(movie.streamingLink).toBe('http://example.com');
  });
});