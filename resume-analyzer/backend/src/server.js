import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { dbService } from './db/firebase.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/aiRoutes.js';
import advancedFeaturesRoutes from './routes/advancedFeatures.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'AI Resume Analyzer API is running',
    version: config.VERSION,
    platform: 'Node.js / Express',
    status: 'healthy',
  });
});

// Mount Routes under /api
app.use('/api', resumeRoutes);
app.use('/api', aiRoutes);
app.use('/api', advancedFeaturesRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'An unexpected error occurred on the server',
  });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await dbService.init();

    const PORT = config.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`🚀 ${config.PROJECT_NAME} v${config.VERSION}`);
      console.log(`🌐 Server running at http://localhost:${PORT}`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`========================================`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
