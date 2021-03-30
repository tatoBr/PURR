const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require( 'bcrypt' );

const { globals:{ SALT_ROUNDS }, models:{ user, message:{ MODEL_NAME: MESSAGE }}} = require('../utils/constants' );

const { MODEL_NAME: USER } = user;
const { USERNAME, MESSAGE_POOL, RECEIVED, SENT, FAVORITE_MESSAGES, FRIENDS, BLOCKED_USERS, signInMethod, local, google, facebook, LOGIN_ATTEMPTS, LOGIN_WAITING_TIME, REFRESH_TOKEN, drafts } = user.fields;

const { DOC_NAME: DRAFTS_DOC } = drafts;
const { DRAFT_TITLE, DRAFT_BODY } = drafts.fields;

const { DOC_NAME: SIGNIN_METHOD } = signInMethod;
const { LOCAL, GOOGLE, FACEBOOK } = signInMethod.enumerators;

const { DOC_NAME: LOCAL_DOC } = local;
const { DOC_NAME: GOOGLE_DOC } = google;
const { DOC_NAME: FACEBOOK_DOC } = facebook;

const { EMAIL: LOCAL_EMAIL, PASSWORD: LOCAL_PASSWORD } = local.fields
const { ID: GOOGLE_ID, EMAIL: GOOGLE_EMAIL } = google.fields
const { ID: FACEBOOK_ID, EMAIL: FACEBOOK_EMAIL } = facebook.fields

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
    [DRAFTS_DOC]:[
        {
            [DRAFT_TITLE]: Schema.Types.String,
            [DRAFT_BODY]: Schema.Types.String
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
    [LOCAL_DOC]: {
        [LOCAL_EMAIL]: {
            type: Schema.Types.String,
            lowercase: true
        },
        [LOCAL_PASSWORD]: Schema.Types.String 
    },
    [GOOGLE_DOC]:{
        [GOOGLE_ID]: Schema.Types.String,
        [GOOGLE_EMAIL]: {
            type: Schema.Types.String,
            lowercase: true
        }
    },
    [FACEBOOK_DOC]: {
        [FACEBOOK_ID]: Schema.Types.String,
        [FACEBOOK_EMAIL]: {
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
        if( this[ SIGNIN_METHOD ] === LOCAL ){            
            let hash = await bcrypt.hash( this[ LOCAL_DOC ][ LOCAL_PASSWORD ], SALT_ROUNDS );
            this[ LOCAL_DOC ][ LOCAL_PASSWORD ] = hash;               
        }        
    } catch ( error ) {
      throw error;
    };
});

schema.methods.vaidatePassword = async function( password ){
    try {
        if( this[ SIGNIN_METHOD ] === LOCAL )
            return await bcrypt.compare( password, this[ LOCAL_DOC ][ LOCAL_PASSWORD ] );
        return null;
    } catch (error) {
        throw error;
    }
}

module.exports = mongoose.model( USER, schema );