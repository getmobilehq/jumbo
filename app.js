require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const buildingRoutes = require('./routes/building');
const buildingTypeRoutes = require('./routes/buildingType');
const buildingAnalyticsRoutes = require('./routes/buildingAnalytics');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Robust CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Swagger UI setup
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/buildings', buildingRoutes);
app.use('/building-types', buildingTypeRoutes);
app.use('/building-analytics', buildingAnalyticsRoutes);
app.use('/pre-assessments', require('./routes/preAssessment'));
app.use('/field-assessments', require('./routes/fieldAssessment'));
app.use('/audit-logs', require('./routes/auditLog'));

app.get('/', (req, res) => res.send('ONYX API - Scalable Backend'));

// Global error handler - must be after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly (not when required by tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`ONYX API running on port ${PORT}`));
}

// Export app for testing
module.exports = app;
