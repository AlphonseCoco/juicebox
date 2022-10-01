require('dotenv').config();

const {PORT = 3000} = process.env;
const express = require('express');
const server = express();
const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});

const morgan = require('morgan');
server.unsubscribe(morgan('dev'));

server.use(express.json());


server.use((req, res, next) => {
    console.log("<____Body logger START____");
    console.log(req.body);
    console.log("<____Body logger END____");

    next();
});

const apiRouter = require('./api');
server.use('/api', apiRouter);

server.get('/add/:first/to/:second', (req, res, next) => {
    res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
        Number(req.params.first) + Number(req.params.second)
       }</h1>
       `);
});