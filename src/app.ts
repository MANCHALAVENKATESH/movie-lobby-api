import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import movieRoutes from './routes/movies';

dotenv.config();

const app = express()

app.use(cors())
app.use(bodyParser.json())


app.use('/',movieRoutes)

export default app;