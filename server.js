'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

/*const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})*/

//const {status} = require('express/lib/response');
//const server = express();
//const usersearch = "The Whole Truth";

//const data = require("./Movie Data/data.json");
//const server = express();

//let bodyParser = require('body-parser');
//let jsonParser = bodyParser.json();



// setting-up the get routes!
server.use(cors());
server.get('/',handleHomePage);
server.get('/trending', trendingHandler);
server.get('/search', searchHandler);
server.get('/changes', changesHandler);
server.get('/latest', latestHandler);
server.post('/addMovie',jsonParser, addMovieHandler);
server.get('/getMovies', getMoviesHandler);
server.use(express.json());
server.use('*', notFoundHandler);
server.use(errorHandler)

function Movie(id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

let numberOfRecipes=5;
let urltrending = `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.APIKEY}&number=${numberOfRecipes}`;
let urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&number=${numberOfRecipes}`;


function handleHomePage(req,res){
    res.status(200).send("welcome :)");

}



function trendingHandler(req,res){
    let movies = [];
    axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.APIKEY}&number=${numberOfRecipes}`)
     .then((result)=>{

        result.data.results.map(movie => {
            let newMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            movies.push(newMovie);
        })
        res.status(200).json(movies);
      
    }).catch((err)=>{

        errorHandler(err,req,res);

    })

}




function searchHandler(req,res){
    let movies = [];

    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query="spider man"}`)
    .then(result=>{
       //console.log(result.data.recipes);

        result.data.results.map(movie => {
            let newMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            movies.push(newMovie);
        })
        res.status(200).json(movies);

    }).catch(err=>{
        errorHandler(err,req,res);
    })
       
}

function changesHandler(req,res){
    let movies=[];

    axios.get(`https://api.themoviedb.org/3/movie/changes?api_key=${process.env.APIKEY}&&query="spider man"`)
    .then(result=>{
       //console.log(result.data.recipes);

        result.data.results.map(movie => {
            let newMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            movies.push(newMovie);
        })
        res.status(200).json(movies);

    }).catch(err=>{
        errorHandler(err,req,res);
    })
       
}


function latestHandler(req,res){
    let movies=[];

    axios.get(`https://api.themoviedb.org/3/person/latest?api_key=${process.env.APIKEY}&query="spider man"`)
    .then(result=>{
       //console.log(result.data.recipes);

        result.data.results.map(movie => {
            let newMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            movies.push(newMovie);
        })
        res.status(200).json(movies);

    }).catch(err=>{
        errorHandler(err,req,res);
    })
       
}

// adding  movie 2 the database

function addMovieHandler(req,res) {
    let movie = req.body;
    let sql = `INSERT INTO movies(id, title, release_date, poster_path, overview) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    let values = [movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(err => {
        errorHandler(err, req, res);
    });
}


function getMoviesHandler(req, res) {
    let sql = `SELECT * FROM movies;`;
    client.query(sql).then(data => {

        res.status(200).json(data.rows);
    }).catch(err => {

        errorHandler(err, req, res);
    });
}











function notFoundHandler(req,res){
    res.status(404).send("This Page is not Found")
}


function errorHandler (error,req,res){
    const err = {
        status : 500,
        messgae : error
    }
    res.status(500).send(err);
    

}


client.connect().then(()=>{

    server.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`);
    })

});





//#########################################################################################################

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*app.get('/', handler);
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
})*/

//console.log(result.recipes);
     // let recipes = result.data.recipes.map(recipe =>{
     //     return new Recipe(recipe.title,recipe.poster_path,recipe.overview)
     //  });
     // forEach use
     //result.data.results.forEach(movie =>{
      //  movies.push(new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview));