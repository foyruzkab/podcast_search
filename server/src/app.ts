import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { searchRouter } from './routes/search';
import { podcastsRouter } from './routes/podcasts';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/search', searchRouter);
app.use('/api/podcasts', podcastsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
