
const Helpers = require('../utils/helpers');
const helpers = new Helpers();

const UsersServices = require('../services/users' );
const usersServices = new UsersServices();

const ServerResponse = require('../utils/serverResponse');
const constants = require( '../utils/constants' );


const { httpStatusCode: { OK, CREATED, BAD_REQUEST }} = constants;

module.exports = class Controller{
    /**
     * 
     * @param { Request } req 
     * @param {*} res 
     */
    signUp = async( req, res )=>{
        let data = req.body;

        try {
            let user = await usersServices.create( req.body );            
            let token = helpers.signToken( user._id.toString());
            
            return res.status( CREATED ).json( new ServerResponse( ServerResponse.USER_SAVED_SUCCESSFULLY, token));

        } catch ( error ) {
            console.trace('userservice -> sign up')
            throw error;
        }
    }

    signIn = async( req, res, next )=>{
        try {
            let user = req.user;            
            let token =  helpers.signToken( user._id.toString());
            
            return res.status( OK ).json( new ServerResponse( ServerResponse.USER_SUCCESSFULLY_LOGGEDIN, token ));

        } catch ( error ) {
            console.trace('userservice -> sign up')
            throw error;
        }
    };

    static getFullUrl( req ){
        return `${req.protocol}://${req.hostname}${req.baseUrl}`;
    }
}