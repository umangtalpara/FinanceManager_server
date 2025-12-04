require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-manager')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/orgs', require('./routes/org.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/approvals', require('./routes/approval.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.get('/', (req, res) => {
    res.send('Finance Manager API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
