const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require( 'bcrypt' );

const { globals:{ SALT_ROUNDS }, models:{ user, message:{ MODEL_NAME: MESSAGE }}} = require('../utils/constants' );

const { MODEL_NAME: USER } = user;
const { EMAIL, USERNAME, PASSWORD, MESSAGE_POOL, RECEIVED, SENT, FAVORITE_MESSAGES, FRIENDS, BLOCKED_USERS, signInMethod, LOGIN_ATTEMPTS, LOGIN_WAITING_TIME, REFRESH_TOKEN, drafts } = user.fields;

const { DOC_NAME: DRAFTS } = drafts;
const { TITLE, BODY} = drafts.fields;

const { DOC_NAME: SIGNIN_METHOD } = signInMethod;
const { LOCAL, GOOGLE, FACEBOOK } = signInMethod.enumerators;

const schema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    [USERNAME]:{
        type: Schema.Types.String,
        required: true,
        index:true,
        unique:true
    },
    [DRAFTS]:[
        {
            [TITLE]: Schema.Types.String,
            [BODY]: Schema.Types.String
        }
    ],
    [MESSAGE_POOL]: [{ type: Schema.Types.ObjectId, ref: MESSAGE }],
    [RECEIVED]: [{ type: Schema.Types.ObjectId, ref: MESSAGE }],
    [SENT]: [{ type: Schema.Types.ObjectId, ref: MESSAGE }],
    [FAVORITE_MESSAGES]: [{ type: Schema.Types.ObjectId, ref: MESSAGE }],
    [FRIENDS]: [{ type: Schema.Types.ObjectId, ref: USER }],
    [BLOCKED_USERS]: [{ type: Schema.Types.ObjectId, ref: USER }],
    [SIGNIN_METHOD]:{
        type: Schema.Types.String,
        enum: [ LOCAL, GOOGLE, FACEBOOK ],
        required: true
    },
    [LOCAL]: {
        [EMAIL]: {
            type: Schema.Types.String,
            lowercase: true
        },
        [PASSWORD]: Schema.Types.String 
    },
    [GOOGLE]:{
        _id: Schema.Types.String,
        [EMAIL]: {
            type: Schema.Types.String,
            lowercase: true
        }
    },
    [FACEBOOK]: {
        _id: Schema.Types.String,
        [EMAIL]: {
            type: Schema.Types.String,
            lowercase: true
        }
    },
    [LOGIN_ATTEMPTS]: {
        type: Schema.Types.Number,
        default: 0,
    },
    [LOGIN_WAITING_TIME]:{
        type: Schema.Types.String,
        default: new Date().toISOString()
    },
    [REFRESH_TOKEN]: String
});

schema.pre( "save", async function(){
    try {
        if( this[SIGNIN_METHOD] === LOCAL ){
            let hash = await bcrypt.hash( this[ LOCAL ][ PASSWORD ], SALT_ROUNDS );
            this[ LOCAL ][PASSWORD] = hash;               
        }        
    } catch ( error ) {
      throw error;
    };
});

schema.methods.vaidatePassword = async function( password ){
    try {

        return await bcrypt.compare( password, this[ LOCAL ][ PASSWORD ] );
    } catch (error) {
        throw error;
    }
}

module.exports = mongoose.model( USER, schema );