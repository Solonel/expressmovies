const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const PORT = 3000;

let frenchMovies = [];

app.use('/public', express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {
    const title = "FrenchMovies";

    frenchMovies =   [{ title: "Toto 1", year: "1" },
    { title: "Toto 2", year: "2" },
    { title: "Toto 3", year: "3" },
    { title: "Toto 4", year: "4" },
    { title: "Toto 5", year: "5" },
    { title: "Toto 6", year: "6" }];

    res.render('movies', { frenchMovies: frenchMovies, title: title });
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//app.post('/movies', urlencodedParser, (req, res) => {
//    const newMovie = { title: req.body.movieTitle, year: req.body.movieYear };
//    frenchMovies = [...frenchMovies, newMovie];
//    res.sendStatus(201);
//});

app.post('/movies-fetch', upload.fields([]), (req, res) => {
    if (req.body) {
        const formData = req.body;
        const newMovie = { title: formData.movieTitle, year: formData.movieYear };
        frenchMovies = [...frenchMovies, newMovie];
        console.log('formData', formData);
        res.sendStatus(201);
    } else {
        return res.sendStatus(500);
    }
});

app.post('/movies-xhr', urlencodedParser, (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {        
        frenchMovies = [... frenchMovies, { title: req.body.movietitle, year: req.body.movieyear }];
        console.log (req.body);
        res.sendStatus(201);
    } 
});


app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.render('movie-details', { movie_id: id });
});

app.get('/search', (req, res) => {
    res.render('movies-search');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});