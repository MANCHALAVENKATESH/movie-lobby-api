  import request from 'supertest';
  import app from '../src/app';
  import mongoose from 'mongoose';

  describe('Movies API', () => {
    beforeAll(async () => {
      await mongoose.connect('mongodb://localhost:27017/movie_lobby_test');
    });

    afterAll(async () => {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
      }
      await mongoose.connection.close();
    });
    

    it('GET /movies - success', async () => {
      const { body } = await request(app).get('/movies');
      expect(body).toBeInstanceOf(Array);
    });

    it('POST /movies - unauthorized', async () => {
      const { status } = await request(app).post('/movies').send({
        title: 'Unauthorized Movie',
        genre: 'Test',
        rating: 5,
        streamingLink: 'http://example.com',
      });
      expect(status).toBe(403);
    });

    it('POST /movies - success', async () => {
      const { body, status } = await request(app)
        .post('/movies')
        .set('isAdmin', 'true')
        .send({
          title: 'Authorized Movie',
          genre: 'Test',
          rating: 5,
          streamingLink: 'http://example.com',
        });
      expect(body.title).toBe('Authorized Movie');
    });
  });