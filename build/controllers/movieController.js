"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.addMovie = exports.searchMovies = exports.getMovies = void 0;
const movie_1 = __importDefault(require("../models/movie"));
const redisClient_1 = __importDefault(require("../redisClient"));
// GET all movies
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedMovies = yield redisClient_1.default.get('movies_list');
        if (cachedMovies) {
            console.log('Cache hit for movies list');
            res.json(JSON.parse(cachedMovies));
            return;
        }
        const movies = yield movie_1.default.find();
        yield redisClient_1.default.set('movies_list', JSON.stringify(movies));
        res.json(movies);
    }
    catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ error: 'An error occurred while fetching movies.' });
    }
});
exports.getMovies = getMovies;
// Search movies
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = ((_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    const cacheKey = `movies_search:${query.toLowerCase()}`;
    try {
        const cachedMovies = yield redisClient_1.default.get(cacheKey);
        if (cachedMovies) {
            console.log('Cache hit for search');
            res.json(JSON.parse(cachedMovies));
            return;
        }
        const movies = yield movie_1.default.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } },
            ],
        });
        yield redisClient_1.default.setEx(cacheKey, 3600, JSON.stringify(movies));
        res.json(movies);
    }
    catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ error: 'An error occurred while fetching movies.' });
    }
});
exports.searchMovies = searchMovies;
// Add a new movie (admin only)
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
        res.status(403).json({ error: 'Admin privileges required' });
        return;
    }
    const { title, genre, rating, streamingLink } = req.body;
    const movie = new movie_1.default({ title, genre, rating, streamingLink });
    try {
        const savedMovie = yield movie.save();
        // Invalidate related cache after a new movie is added
        yield redisClient_1.default.del('movies_list');
        res.status(201).json(savedMovie);
    }
    catch (err) {
        console.error('Error saving movie:', err);
        res.status(400).json({ error: 'An error occurred while saving the movie.' });
    }
});
exports.addMovie = addMovie;
// Update a movie (admin only)
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
        res.status(403).json({ error: 'Admin privileges required' });
        return;
    }
    const { id } = req.params;
    try {
        const updatedMovie = yield movie_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedMovie) {
            res.status(404).json({ error: 'Movie not found' });
        }
        else {
            // Invalidate cache after updating
            yield redisClient_1.default.del('movies_list');
            res.json(updatedMovie);
        }
    }
    catch (err) {
        console.error('Error updating movie:', err);
        res.status(400).json({ error: 'An error occurred while updating the movie.' });
    }
});
exports.updateMovie = updateMovie;
// Delete a movie (admin only)
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
        res.status(403).json({ error: 'Admin privileges required' });
        return;
    }
    const { id } = req.params;
    try {
        const deletedMovie = yield movie_1.default.findByIdAndDelete(id);
        if (!deletedMovie) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        // Invalidate cache after deletion
        yield redisClient_1.default.del('movies_list');
        res.json({ message: 'Movie deleted successfully.' });
    }
    catch (err) {
        console.error('Error deleting movie:', err);
        res.status(400).json({ error: 'An error occurred while deleting the movie.' });
    }
});
exports.deleteMovie = deleteMovie;
