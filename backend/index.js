import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './DB/connectDB.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoute from './routes/authRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/task',taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


