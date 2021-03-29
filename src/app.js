const express = require('express');
const morgan = require('morgan')

const db = require('./database/connection' );

const { httpStatusCode:{ NOT_FOUND, INTERNAL_SERVER_ERROR }} = require('./utils/constants')
const ServerResponse = require( './utils/serverResponse' );

const app = express();

//setting up middlewares
app.use( express.urlencoded({ extended: false }));
app.use( express.json());
app.use( morgan( 'dev' ));

//importing routes
const userRouter = require('./routes/users');

//setting up routes 
app.use('/users', userRouter );

//handling errors
app.use(( req, res )=>{
    res.status( NOT_FOUND ).json( new ServerResponse( ServerResponse.PATH_NOT_FOUND_MSG ));
});

app.use((error, req, res, next )=>{    
    res.status( INTERNAL_SERVER_ERROR ).json( new ServerResponse( error.message || ServerResponse.COMMON_ERROR_MSG, error.name ));
})

module.exports = app;

