import express from 'express';
import {
  getMovies,
  searchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController';

const router = express.Router();

router.get('/movies', getMovies); // List all movies
router.get('/search', searchMovies); // Search movies
router.post('/movies', addMovie); // Add a new movie (admin)
router.put('/movies/:id', updateMovie); // Update a movie (admin)
router.delete('/movies/:id', deleteMovie); // Delete a movie (admin)

export default router;