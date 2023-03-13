import express from 'express';
import dotenv from 'dotenv';
import log from './scripts/log';
import { PORT, POSTS_API } from './config';
import requestLogger from './middleware/requestLogger';
import responseHeaders from './middleware/responseHeaders';
import postsRouter from './routes/api/postsRouter';

dotenv.config();
const app = express();

process.on('uncaughtException', (err) => {
  log(`Uncaught exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

app.use(express.urlencoded());
app.use(express.json());
app.use(requestLogger());
app.use(responseHeaders());
app.use(POSTS_API, postsRouter);

app.all('*', (req, res) => {
  res.statusCode = 404; // Not Found
  res.end();
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
