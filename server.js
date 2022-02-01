'use strict';


const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())

const data = require("./Movie Data/data.json");



app.get('/', handler);
app.get('/favorite', favoriteHandler);
app.get("*", notFoundHndler);

//constructor
function movie(title, poster_path, overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}




function favoriteHandler(req,res){
    return res.status(200).send("Welcome to Favorite Page ");

}



function handler(req,res){
    let MMovie=[];
    data.Moviedata.map(Movie =>{
        let nMovie = new Movie(movie.title, movie.poster_path, movie.overview)
        recipes.push(nMovie)
    })
    console.log(MMovie)
    return res.status(200).json(MMovie)
}

function notFoundHndler(req,res){
    return res.status(404).send('Not found')
}



app.listen(3000, ()=>{

    console.log('listening to port 3000')
})

