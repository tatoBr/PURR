const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require( 'bcrypt' );

const { globals:{ SALT_ROUNDS }, models:{ user, message:{ MODEL_NAME: MESSAGE }}} = require('../utils/constants' );

const { MODEL_NAME: USER } = user;
const { USERNAME, EMAIL, PASSWORD, GOOGLE_ID, FACEBOOK_ID, signUpMethod } = user.properties;
const { MESSAGE_POOL, SENT, RECEIVED, FAVORITE_MESSAGES, drafts } = user.properties
const { FRIENDS, BLOCKED_USERS, LOGIN_ATTEMPTS, LOGIN_WAITING_TIME, REFRESH_TOKEN } = user.properties;

const { DOC_NAME: DRAFTS_DOC } = drafts;
const { DRAFT_TITLE, DRAFT_BODY } = drafts.fields;

const { DOC_NAME: SIGN_UP_METHOD } = signUpMethod;
const { LOCAL, GOOGLE, FACEBOOK } = signUpMethod.enumerators;

exports.UserClass = class User{
    /**
     * Class User constructor method
     * @param { String } username required
     * @param { String } email required
     * @param { String } signUpMethod local, google or facebook
     * @param { String } password required if signUpMethod is local
     * @param { String } google_id required if signUpMethod is google
     * @param { String } facebook_id required if signUpMethod is facebook
     */
    constructor( username, email, signUpMethod, options = {}){
        this[ USERNAME ] = username;
        this[ EMAIL ] = email;
        this[ SIGN_UP_METHOD ] = signUpMethod;
        this[ PASSWORD ] = options[ PASSWORD ] || '';
        this[ GOOGLE_ID ] = options[ GOOGLE_ID ] || '';
        this[ FACEBOOK_ID ] = options[ FACEBOOK_ID ] || '';
        this[ DRAFTS_DOC ] = options[ DRAFTS_DOC ] || [];
        this[ MESSAGE_POOL ] = options[ MESSAGE_POOL ] || [];
        this[ RECEIVED ] =  options[ RECEIVED ] || [];
        this[ SENT ] = options[ SENT ] || [];
        this[ FAVORITE_MESSAGES ] = options[ FAVORITE_MESSAGES ] || [];
        this[ FRIENDS ] = options[ FRIENDS ] || [];
        this[ BLOCKED_USERS ] = options[ BLOCKED_USERS ] || [];
        this[ LOGIN_ATTEMPTS ] = 0;
        this[ LOGIN_WAITING_TIME ] = options[ LOGIN_WAITING_TIME ] || new Date( Date.now()).toISOString();           
    }
}

const schema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        required: true,
    },
    [USERNAME]:{
        type: Schema.Types.String,
        required: true,
        index:true,
        unique:true
    },
    [ EMAIL ]:{
        type: Schema.Types.String,
        required: true,
        index:true,
        unique:true
    },
    [ SIGN_UP_METHOD ]:{
        type: Schema.Types.String,
        enum: [ LOCAL, GOOGLE, FACEBOOK ],
        required: true
    },
    [ PASSWORD ]: Schema.Types.String,
    [ GOOGLE_ID ]: Schema.Types.String,
    [ FACEBOOK_ID ]: Schema.Types.String,
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
        if( this[ SIGN_UP_METHOD ] === LOCAL ){            
            let hash = await bcrypt.hash( this[ PASSWORD ], SALT_ROUNDS );
            this[ PASSWORD ] = hash;               
        }        
    } catch ( error ) {
      throw error;
    };
});

schema.methods.vaidatePassword = async function( password ){
    try {
        if( this[ SIGNIN_METHOD ] === LOCAL )
            return await bcrypt.compare( password, this[ PASSWORD ] );
        return null;
    } catch (error) {
        throw error;
    }
}
exports.UserModel = mongoose.model( USER, schema );

    