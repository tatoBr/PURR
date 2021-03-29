const mongoose = require('mongoose');
const { Schema } = mongoose;

const { models: { message, user:{ MODEL_NAME: USER} }} = require('../utils/constants');
const { MODEL_NAME: MESSAGE } = message;
const { TITLE, BODY, AUTHOR, EXPIRES_AT, meta } = message.fields;
const { DOC_NAME: META } = meta;
const { FAVORED, TAGS } = meta.fields;


const schema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    [TITLE]:{
        type: Schema.Types.String,
        required: true,
        index: true
    },
    [BODY]:{
        type: Schema.Types.String,
        required:true
    },
    [AUTHOR]:{
        type: Schema.Types.ObjectId,
        required:true,
        index:true,
        ref: USER
    },    
    [EXPIRES_AT]: Schema.Types.String,
    [META]:{
        [FAVORED]:Schema.Types.Number,
        [TAGS]:[Schema.Types.String]
    }    
});

module.exports = mongoose.model( MESSAGE, schema );
 