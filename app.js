const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const faker = require('faker');

mongoose.connect('mongodb://solonel:azertyui@ds159676.mlab.com:59676/expressmovies');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error : cannot connect database'));
db.once('open', () => {
    console.log('Connected to database');
})

const movieSchema = mongoose.Schema({
    movieTitle: String,
    movieYear: Date
});

const Movie = mongoose.model('Movie', movieSchema);
const title = faker.lorem.sentence(4)
const year = faker.date.past(2017);
const myMovie = new Movie({ movieTitle: title, movieYear: year });



myMovie.save((err, savedMovie) => {
    if (err) {
        console.error(err);
    } else {
        console.log('SavedMovie', savedMovie)
    }
});

const SECRET = 'secret'
const PORT = 3000;

let frenchMovies = [];

app.use('/public', express.static('public'));

app.use(expressJwt({ secret: SECRET }).unless({ path: ['/login', '/search', '/movies', '/', '/movies-fetch', '/movies-xhr'] }));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {
    const title = "FrenchMovies";

    Movie.find((err, movies) => {
        if (err) {
            console.error('Could get movies in DB');
        } else {
            frenchMovies = movies;
            res.render('movies', { frenchMovies: frenchMovies, title: title });
        }
    })

});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/movies-fetch', upload.fields([]), (req, res) => {
    if (req.body) {
        const formData = req.body;
        const newMovie = new Movie({ movieTitle: formData.movieTitle, movieYear: formData.movieYear });

        newMovie.save((err, savedMovie) => {
            if (err) {
                console.error(err);
                return;
            } else {
                console.log('SavedMovie', savedMovie);
                res.sendStatus(201);
            }
        });
    } else {
        return res.sendStatus(500);
    }
});

app.post('/movies-xhr', urlencodedParser, (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        const newMovie = new Movie({ movieTitle: formData.movieTitle, movieYear: formData.movieYear });

        newMovie.save((err, savedMovie) => {
            if (err) {
                console.error(err);
                return;
            } else {
                console.log('SavedMovie', savedMovie);
                res.sendStatus(201);
            }
        });
    }
});


app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.render('movie-details', { movie_id: id });
});

app.get('/search', (req, res) => {
    res.render('movies-search');
});

app.get('/login', (req, res) => {
    const title = 'Espace user';
    res.render('login', { title: title });
});

const fakeUser = { email: "test@mail.fr", password: "123" }

app.post('/login', urlencodedParser, (req, res) => {
    console.log('body', req.body)
    if (req.body) {
        if (fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const userToken = jwt.sign({ iss: 'http://expressmovies.fr', user: 'Sam', scope: 'admin' }, SECRET);
            res.json(userToken);
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/member-only', (req, res) => {
    console.log('req.user', req.user)
    res.send(req.user);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});