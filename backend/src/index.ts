import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import coursesRoutes from './routes/courses.routes';
import lessonsRoutes from './routes/lessons.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notesRoutes from './routes/notes.routes';
import categoriesRoutes from './routes/categories.routes';
import { errorHandler } from './middleware/errorHandler';
import config from './config';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: config.cors.credentials,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get(config.routes.health, (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use(config.routes.auth, authRoutes);
app.use(config.routes.users, usersRoutes);
app.use(config.routes.courses, coursesRoutes);
app.use(config.routes.lessons, lessonsRoutes);
app.use(config.routes.dashboard, dashboardRoutes);
app.use(config.routes.notes, notesRoutes);
app.use(config.routes.categories, categoriesRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.server.port, () => {
  console.log(`🚀 Server is running on port ${config.server.port}`);
  console.log(`📝 Environment: ${config.server.env}`);
  console.log(`🌐 CORS enabled for: ${config.cors.allowedOrigins.join(', ')}`);
});

export default app;
