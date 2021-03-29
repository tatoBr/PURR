const jwt = require( 'jsonwebtoken' );
const { ACCESS_TOKEN_SECRET } = require('../config');

module.exports = class Helpers{
    isObject( variable ){
        return Object.prototype.toString.call( variable ) === '[object Object]'; 
    };
    
    /**
     * Check if an object has undefined, null or NaN properties
     * @param { Object } obj - any javascript object
     */
    hasInvalidProperty( obj ){
        //first check if argument is a valid object
        if( Object.prototype.toString.call( obj ) !== '[object Object]')
        throw new TypeError();    
        
        for( let value of Object.values( obj )){
            let type = Object.prototype.toString.call( value );
            if( value !== value  || type === '[object Undefined]' || type === '[object Null]' )
            return true;
        }
        return false;
    }
    
    signToken( id, issuer ){
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
}
