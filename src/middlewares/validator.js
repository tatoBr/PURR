const Joi = require('joi');
const { httpStatusCode:{ BAD_REQUEST }} = require( '../utils/constants' );
const ServerResponse = require('../utils/serverResponse');

module.exports = {
    validateBody: schema => {
        return ( req, res, next )=>{
            const result = schema.validate( req.body );
            if( result.error ) 
                return res.status( BAD_REQUEST ).json( new ServerResponse( ServerResponse.INVALID_REQUEST_PROPERTY_MSG, result.error ))
            
            if( !req.value ) req.value = {};
            req.body = result.value;
            
            next()
        }
    },
    schemas:{
        signUp: Joi.object().keys({
            username: Joi.string()
                .required()
                .trim()
                .min(3)
                .max(24)
                .regex(/^\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            email: Joi.string()
                .required()
                .trim()
                .lowercase({ force: true })
                .email(),
            password: Joi.string()
                .required()
                .trim()
                .min(8)
                .max(24)                
        }),

        signIn: Joi.object().keys({
            email: Joi.string()
                .required()
                .trim()
                .lowercase()
                .email(),
            password: Joi.string()
                .required()
                .trim()
                .min(8)
                .max(24)
        }),
    }
}