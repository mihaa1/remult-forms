// write express server template
import express from 'express';
import { api } from './api';

const app = express();
const port = 3000;
app.use(api);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
