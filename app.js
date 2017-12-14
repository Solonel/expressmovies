const express = require('express');
const app = express();

const PORT = 3000;

app.use('/public', express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {
    res.render('movies');
});

app.get('/movies/add', (req, res) => {
    res.render('add-movie');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.render('movie-details', { movie_id : id });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});