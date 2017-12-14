/* 1. Configurer votre environnement de développement */
/* 2. Un serveur Express en moins de 3 minutes */
/* 3. Installer nodemon 'globally' */
/* Next Vidéo - 4. Relancer le serveur Node automatiquement pendant le développement nodemon */

const express = require('express');
const app = express();

const PORT = 3000;

app.get('/',  (req, res) => {
    res.send('Hello World !');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});