const jwt = require( 'jsonwebtoken' );
const { ACCESS_TOKEN_SECRET } = require('../config');
const { custon_error_messages: { INVALID_PARAMETER_TYPER_ERRMSG }} = require( './constants' );

const isObject = ( variable )=>{
    return Object.prototype.toString.call( variable ) === '[object Object]'; 
};

/**
 * Check if an object has undefined, null or NaN 
 * @param { Object } obj - any javascript object
 */
const hasInvalidProperty = ( obj )=>{
    if( Object.prototype.toString.call( obj ) !== '[object Object]')
        throw new TypeError();    
    
    for( let value of Object.values( obj )){
        let type = Object.prototype.toString.call( value );
        if( value !== value  || type === '[object Undefined]' || type === '[object Null]' )
            return true;
    }
    return false;
}

const signToken = ( id, issuer )=>{
    if( typeof id !=='string' || typeof issuer !== 'string' )
        throw new TypeError();
        
    let token = jwt.sign({
        iss: issuer,
        sub: id,
        iat: Date.now(),
        exp: Date.now() + ( 1000 * 60 * 60 * 24 )
    }, ACCESS_TOKEN_SECRET );    
    
    return token;
};

module.exports = {
    isObject,
    hasInvalidProperty,
    signToken
}