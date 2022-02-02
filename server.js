///////////////////////////////////////////////
//########////////////////////////////////////##########


const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())


const data = require('./Movie Data/data.json');


app.get('/', handler);
app.get('/favorite', favoriteHandler);
app.get("*", notFoundError);


function videoFilm(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function handler(req,res) {
    let Movie = [];
    data.Film.map(moVie => {
        let newFilm = new videoFilm(moVie.title, moVie.poster_path, moVie.overview);
        Movie.push(newFilm);
    });
    

    return res.status(200).json(Movie);
}


function favoriteHandler(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}


function notFoundError(req, res) {
    return res.status(404).send("page not founds");
}




app.listen(3000, () => {
    console.log("listening to port: " + 3000);
})
