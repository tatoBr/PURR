const { Types } = require( 'mongoose' );
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');
const MsgModel = require('../models/message');

const Helpers = require('../utils/helpers' );
const helpers = new Helpers();

const {
    globals: { SALT_ROUNDS },
    models: { user, message: { MODEL_NAME: MESSAGE }}
} = require('../utils/constants');

const { MODEL_NAME: USER } = user;
const {
    EMAIL, USERNAME, PASSWORD, MESSAGE_POOL,
    RECEIVED, SENT, FAVORITE_MESSAGES, FRIENDS,
    BLOCKED_USERS, LOGIN_ATTEMPTS,
    LOGIN_WAITING_TIME, REFRESH_TOKEN, drafts
} = user.fields;

const { DOC_NAME: DRAFTS } = drafts;
const { TITLE, BODY } = drafts.fields;

class Services {
    static INVALID_ARGUMENT_ERRMSG = 'Data argument is not valid or has one or more invalid properties in it';
    static INVALID_DATA_PARAMETER_PROPERTIES_ERRMSG = 'One or more properties in data parameter are invalid';
    static USER_ALREADY_EXIST_ERRMSG = 'UserAlreadyExistsError';        
    static EMAIL_ALREADY_TAKEN_ERRMSG = "EmailAlreadyTakenError";
    static USERNAME_NOT_AVALIABLE_ERRMSG = "UsernameNotAvaliableError";

    create = async data => {
        try {           
            if( !helpers.isObject( data ) || helpers.hasInvalidProperty( data ))
                throw new TypeError( Services.INVALID_ARGUMENT_ERRMSG );            
            
            let userData = {
                _id: new Types.ObjectId(),
                [EMAIL]: data[EMAIL],
                [USERNAME]: data[USERNAME],
                [PASSWORD]: data[PASSWORD],
                [DRAFTS]: [],
                [MESSAGE_POOL] :[],
                [RECEIVED]: [],
                [SENT]: [],
                [FAVORITE_MESSAGES]: [],
                [FRIENDS]: [],
                [BLOCKED_USERS]: [],
                [LOGIN_ATTEMPTS]: 0,
                [LOGIN_WAITING_TIME]: new Date(),
                [REFRESH_TOKEN]: ''                 
            };           

            let existingUser = await UserModel.findOne({ $or:[{[ EMAIL ]: userData[ EMAIL ]}, {[ USERNAME ]: userData[ USERNAME ]}]});

            if( existingUser ){
                if( existingUser[EMAIL] === userData[EMAIL])
                    throw new Error( Services.EMAIL_ALREADY_TAKEN_ERRMSG );
                
                throw new Error( Services.USERNAME_NOT_AVALIABLE_ERRMSG );
            }
            
            let createdUser = new UserModel( userData );
            await createdUser.save();

            return createdUser;            
        } catch ( error ) {
            throw error;
        }
    }   
}
module.exports = Services;
