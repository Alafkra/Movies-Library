'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
const server = express();


server.use(cors());
server.get('/',handleHomePage);
server.get('/trending', trendingHandler);
server.get('/search', searchHandler);
server.get('/changes', changesHandler);
server.get('/latest', latestHandler);
server.post('/addMovie',jsonParser, addMovieHandler);
server.get('/getMovies', getMoviesHandler);
server.use(express.json());

server.put('/UPDATE/:id', jsonParser, updateMovie);
server.delete('/DELETE/:id', deleteMovie);

//server.get('/getMovie/:id', getMovie);

server.use('*', notFoundHandler);
server.use(errorHandler)

server.put('/updateMovie/:id/:name',updateMovieHandler); // the name param is just for testing 
server.delete('/deleteMovie/:id',deleteMovieHandler);

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

///////////////////////////////////

// updating a specific info
function updateMovie(req, res) {
    let id = req.params.id;
    let movie = req.body;
    let sql = `UPDATE movies SET title=$1, release_date=$2, poster_path=$3, overview=$4 WHERE id=${id} RETURNING *;`;
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(err => {
        errorHandler(err, req, res);
    });
}
// delete a movie 
function deleteMovie(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM movies WHERE id=${id};`;
    client.query(sql).then(() => {
        res.status(200).send(`Movie ${id} has been deleted !`);
    }).catch(err => {
        errorHandler(err, req, res);
    });
}



