const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('./utils/multer');
const {ApolloServer} = require("apollo-server-express");

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();

const dotenv = require('dotenv').config();

app.use(express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
    next();
})

app.use(bodyParser.json({limit: '10mb'}));
app.use(multer().single('image'));

app.use('/feed', feedRoutes);
app.use(authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const data = error.data;

    res.status(status)
        .json({
            message: error.message,
            data: data
        })
})

const server = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers,
    formatError: error => {
        return error;
    },
    context: ({req, res}) => {
        return {req, res,}
    },
})
server.start()
    .then(() =>
        server.applyMiddleware({app, path: "/graphql"})
    )
    .catch(err => console.log(err));


mongoose.connect('mongodb://localhost:27017/test')
    .then(() => {
        console.log('Connected to the database');
        const server = app.listen(5000, () => {
            console.log('Listening on port 5000');
        });
    })
    .catch(err => console.log(err))

