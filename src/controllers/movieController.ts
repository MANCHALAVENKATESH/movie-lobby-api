import { Request, Response } from 'express';
import Movie, { IMovie } from '../models/movie';
import redisClient from '../redisClient';

// GET all movies
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const cachedMovies = await redisClient.get('movies_list');

    if (cachedMovies) {
      console.log('Cache hit for movies list');
      res.json(JSON.parse(cachedMovies));
      return;
    }

    const movies: IMovie[] = await Movie.find();

    await redisClient.set('movies_list',JSON.stringify(movies));

    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'An error occurred while fetching movies.' });
  }
};

// Search movies
export const searchMovies = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q?.toString() || '';
  const cacheKey = `movies_search:${query.toLowerCase()}`;

  try {
    const cachedMovies = await redisClient.get(cacheKey);

    if (cachedMovies) {
      console.log('Cache hit for search');
      res.json(JSON.parse(cachedMovies));
      return;
    }

    const movies: IMovie[] = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
      ],
    });

    await redisClient.set(cacheKey, JSON.stringify(movies));

    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'An error occurred while fetching movies.' });
  }
};

// Add a new movie (admin only)
export const addMovie = async (req: Request, res: Response): Promise<void> => {
  if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }

  const { title, genre, rating, streamingLink } = req.body;
  const movie = new Movie({ title, genre, rating, streamingLink });

  try {
    const savedMovie = await movie.save();

    // Invalidate related cache after a new movie is added
    await redisClient.del('movies_list');

    res.status(201).json(savedMovie);
  } catch (err) {
    console.error('Error saving movie:', err);
    res.status(400).json({ error: 'An error occurred while saving the movie.' });
  }
};

// Update a movie (admin only)
export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }

  const { id } = req.params;
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMovie) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      // Invalidate cache after updating
      await redisClient.del('movies_list');
      res.json(updatedMovie);
    }
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(400).json({ error: 'An error occurred while updating the movie.' });
  }
};

// Delete a movie (admin only)
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }

  const { id } = req.params;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    // Invalidate cache after deletion
    await redisClient.del('movies_list');

    res.json({ message: 'Movie deleted successfully.' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(400).json({ error: 'An error occurred while deleting the movie.' });
  }
};

