const UsersServices = require('../services/users' );
const usersServices = new UsersServices();

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require( 'passport-local');
const GoogleOAuthStrategy = require( 'passport-google-plus-token' );

const { ACCESS_TOKEN_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../config/index');
const UserModel = require('../models/user');

const { models:{ user }} = require('../utils/constants' );

const { USERNAME, local, google, facebook, signInMethod } = user.fields;

const { DOC_NAME: SIGNIN_METHOD }  = signInMethod
const { DOC_NAME: LOCAL_DOC } = local
const { DOC_NAME: GOOGLE_DOC } = google
const { DOC_NAME: FACEBOOK_DOC } = facebook

const { LOCAL, GOOGLE, FACEBOOK } = signInMethod.enumerators
const { EMAIL: LOCAL_EMAIL, PASSWORD: LOCAL_PASSWORD } = local.fields
const { ID: GOOGLE_ID, EMAIL: GOOGLE_EMAIL } = google.fields;
const { ID: FACEBOOK_ID, EMAIL: FACEBOOK_EMAIL } = facebook.fields;

//JSON WEB TOKENS STRATEGY
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_TOKEN_SECRET,
    passReqToCallback: true       
};

/**
 * @param {*} req
 * @param {*} payload 
 * @param { Function } done 
 */
let jwtVerifyCallback = async( req, payload, done )=>{
    try {
        const user = await UserModel.findById( payload.sub );
        if(!user) return done( null, false );
        req.user = user;
        return done( null, user );
    } catch (error) {
        done( error, false );
    }
};
let jwtStrategy = new JwtStrategy( jwtOptions, jwtVerifyCallback );

//LOCAL STRATEGY
let localOptions = {
    usernameField: 'email'
}
/**
 *  
 * @param {String} email 
 * @param {String} password 
 * @param {Function} done 
 * @returns 
 */
let localVerifyCallback = async( email, password, done ) => {
    try {        
        let user = await UserModel.findOne({[`${LOCAL_DOC}.${LOCAL_EMAIL}`] : email })
        if( !user ) return done( null, false );

        let passwordMatch = user.vaidatePassword( password );
        if( !passwordMatch ) return done( null, false );
        
        return done( null, user );
    } catch (error) {
        done( error, false )
    }
};
let localStrategy = new LocalStrategy( localOptions, localVerifyCallback );


//GOOGLE OAUTH2 STRATEGY
let googleOptions = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}
let googleVerifyCallback = async( req, accessToken, refreshToken, profile, next) => {
    try {
        //check if user exist
        let existingUser = await UserModel.findOne({[`${GOOGLE_DOC}.${GOOGLE_ID}`] : profile.id });
        if( existingUser ) return next( new Error( UsersServices.USER_ALREADY_EXIST_ERRMSG ));

        let data = {
            [USERNAME]: req.body[ USERNAME ],
            [SIGNIN_METHOD]: GOOGLE,           
            [LOCAL_DOC]: { 
                [LOCAL_EMAIL]: null,
                [LOCAL_PASSWORD]: null
            },
            [GOOGLE_DOC]: {
                [GOOGLE_ID]: profile.id,
                [GOOGLE_EMAIL]: profile.emails[0].value
            },
            [FACEBOOK_DOC]: {
                [FACEBOOK_ID]: null,
                [FACEBOOK_EMAIL]: null
            }
        };
        
        let user = await usersServices.create( data );
        next( null, user );
    } catch (error) {
        next( error, false );
    }    
}

let oAuthStrategy = new GoogleOAuthStrategy( googleOptions, googleVerifyCallback );

module.exports = {
    jwtStrategy,
    localStrategy,
    oAuthStrategy
}

