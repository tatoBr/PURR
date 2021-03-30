const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require( 'passport-local');
const GoogleOAuthStrategy = require( 'passport-google-plus-token' );

const { ACCESS_TOKEN_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../config/index');
const UserModel = require('../models/user');

const { models:{ user }} = require('../utils/constants' );
const { EMAIL } = user.fields;

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
        console.log( email )
        console.log( password )

        let user = await UserModel.findOne({[ EMAIL ] : email })
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
let oAuthOptions = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}
let oAuthVerifyCallback = async( req, accessToken, refreshToken, profile, next) => {
    console.log( 'Estou aqui;')
    console.log( 'requisition', req );
    console.log( 'access token', accessToken );
    console.log( 'refresh token', refreshToken );
    console.log( 'profile', profile );
    next( null, false );
}

let oAuthStrategy = new GoogleOAuthStrategy( oAuthOptions, oAuthVerifyCallback );

module.exports = {
    jwtStrategy,
    localStrategy,
    oAuthStrategy
}

