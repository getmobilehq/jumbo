require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const buildingRoutes = require('./routes/building');
const buildingTypeRoutes = require('./routes/buildingType');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/buildings', buildingRoutes);
app.use('/building-types', buildingTypeRoutes);
app.use('/pre-assessments', require('./routes/preAssessment'));
app.use('/field-assessments', require('./routes/fieldAssessment'));
app.use('/audit-logs', require('./routes/auditLog'));

app.get('/', (req, res) => res.send('ONYX API - Scalable Backend'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ONYX API running on port ${PORT}`));
