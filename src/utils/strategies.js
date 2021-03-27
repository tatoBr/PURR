const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { ACCESS_TOKEN_SECRET } = require('../config/index');
const UserModel = require('../models/user');

//JSON WEB TOKENS STRATEGY
let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_TOKEN_SECRET       
};

let verifyCallback = async( payload, done )=>{
    try {
        const user = await UserModel.findById( payload.sub );
        if(!user) return done( null, false );
        //req.user = user;
        done( null, user );
    } catch (error) {
        done( error, false );
    }
};

let jwtStrategy = new JwtStrategy( options, verifyCallback );

module.exports = {
    jwtStrategy
}

