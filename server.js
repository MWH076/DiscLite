const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Discord OAuth2 Authentication
app.get('/auth', (req, res) => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=1276332030275092641&redirect_uri=http://localhost:3000/callback&response_type=code&scope=identify+guilds`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', null, {
        params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/callback',
        },
    });

    req.session.accessToken = tokenResponse.data.access_token;
    res.redirect('/');
});

// Fetching User's Servers
app.get('/servers', async (req, res) => {
    if (!req.session.accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${req.session.accessToken}`,
        },
    });

    res.json(response.data);
});

// Adding a Server
app.post('/add-server', (req, res) => {
    // Implement server addition logic (e.g., saving to a database)
    // For now, just log the added server
    console.log('Server added:', req.body);
    res.status(200).send('Server added');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});