const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { activePage: 'episodes' });
});

app.get('/about', (req, res) => {
    res.render('about', { activePage: 'about' });
});

app.get('/blog', (req, res) => {
    res.render('blog', { activePage: 'blog' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { activePage: 'contact', submitted: false });
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New message from ${name} <${email}>: ${message}`);
    res.render('contact', { activePage: 'contact', submitted: true });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
