const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require( 'passport-local')

const { ACCESS_TOKEN_SECRET } = require('../config/index');
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
    usernameField: 'email',
    passReqToCallback: true
}

/**
 * 
 * @param {*} req 
 * @param {String} email 
 * @param {String} password 
 * @param {Function} done 
 * @returns 
 */
let localVerifyCallback = async( req, email, password, done ) => {
    try {
        console.log( email )
        console.log( password )

        let user = await UserModel.findOne({[ EMAIL ] : email })
        if( !user ) return done( null, false );

        let passwordMatch = user.vaidatePassword( password );
        if( !passwordMatch ) return done( null, false );

        req.user = user;
        return done( null, user );
    } catch (error) {
        done( error, false )
    }
};
let localStrategy = new LocalStrategy( localOptions, localVerifyCallback );

module.exports = {
    jwtStrategy,
    localStrategy
}

