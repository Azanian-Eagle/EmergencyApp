const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rate Limiting
// Limit each IP to 100 requests per 15 minutes window
// This protects against DoS attacks and spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting to all requests starting with /api
app.use('/api', limiter);

// In-memory storage (mock database)
let contacts = [];
let alerts = [];

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Get contacts
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// Add contact
app.post('/api/contacts', (req, res) => {
    const contact = req.body;
    if (!contact.name || (!contact.phone && !contact.email)) {
        return res.status(400).json({ error: 'Name and either phone or email are required' });
    }
    contact.id = Date.now().toString();
    contacts.push(contact);
    res.status(201).json(contact);
});

// Trigger Alert
app.post('/api/alert', (req, res) => {
    const alertData = req.body;
    console.log('--- EMERGENCY ALERT RECEIVED ---');
    console.log(JSON.stringify(alertData, null, 2));

    // In a real app, this would trigger SMS/Email dispatch
    alerts.push({
        ...alertData,
        receivedAt: new Date(),
        status: 'dispatched' // Simulated dispatch
    });

    res.json({ success: true, message: 'Alert dispatched to contacts' });
});

// Serve frontend static files (production)
// We will assume frontend build goes to ../frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            // Immutable cache for versioned assets (1 year)
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            // No cache for index.html and other non-versioned files
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

app.get('/:any', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
