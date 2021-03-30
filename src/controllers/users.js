
const Helpers = require('../utils/helpers');
const helpers = new Helpers();

const UsersServices = require('../services/users' );
const usersServices = new UsersServices();

const ServerResponse = require('../utils/serverResponse');
const constants = require( '../utils/constants' );

const { USERNAME, local, google, facebook, signInMethod } = constants.models.user.fields

const { DOC_NAME: SIGNIN_METHOD } = signInMethod
const { DOC_NAME: LOCAL_DOC } = local;
const { DOC_NAME: GOOGLE_DOC } = google;
const { DOC_NAME: FACEBOOK_DOC } = facebook;

const { LOCAL, FACEBOOK, GOOGLE } = signInMethod.enumerators;
const { EMAIL: LOCAL_EMAIL, PASSWORD: LOCAL_PASSWORD } = local.fields;
const { ID: GOOGLE_ID, EMAIL: GOOGLE_EMAIL } = google.fields;
const { ID: FACEBOOK_ID, EMAIL: FACEBOOK_EMAIL } = facebook.fields;

const { httpStatusCode: { OK, CREATED, BAD_REQUEST }, models:{ user: { fields: {}}}} = constants;

module.exports = class Controller{    
    signUp = async( req, res, next )=>{
        try {            
            let data = {
                [USERNAME]: req.body[ USERNAME ],
                [SIGNIN_METHOD]: LOCAL,           
                [LOCAL_DOC]: { 
                    [LOCAL_EMAIL]: req.body[ LOCAL_EMAIL ],
                    [LOCAL_PASSWORD]: req.body[ LOCAL_PASSWORD ]
                },
                [GOOGLE_DOC]: {
                    [GOOGLE_ID]: null,
                    [GOOGLE_EMAIL]: null
                },
                [FACEBOOK_DOC]: {
                    [FACEBOOK_ID]: null,
                    [FACEBOOK_EMAIL]: null
                    }
            };
                       
            let user = await usersServices.create( data );            
            let token = helpers.signToken( user._id.toString());            
            return res.status( CREATED ).json( new ServerResponse( ServerResponse.USER_SAVED_SUCCESSFULLY, token));

        } catch ( error ) {            
            next( error )
        }
    }

    signIn = async( req, res, next )=>{
        try {
            let user = req.user;            
            let token =  helpers.signToken( user._id.toString());
            
            return res.status( OK ).json( new ServerResponse( ServerResponse.USER_SUCCESSFULLY_LOGGEDIN, token ));

        } catch ( error ) {            
            next( error );
        }
    };

    static getFullUrl( req ){
        return `${req.protocol}://${req.hostname}${req.baseUrl}`;
    }
}