const { Types } = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');
const MsgModel = require('../models/message');

const Helpers = require('../utils/helpers');
const helpers = new Helpers();

const {
    globals: { SALT_ROUNDS },
    models: { user, message: { MODEL_NAME: MESSAGE } }
} = require('../utils/constants');

const { MODEL_NAME: USER } = user;
const {
    USERNAME, MESSAGE_POOL, RECEIVED,
    SENT, FAVORITE_MESSAGES, FRIENDS,
    BLOCKED_USERS, signInMethod, LOGIN_ATTEMPTS,
    LOGIN_WAITING_TIME, REFRESH_TOKEN, drafts,
    local, google, facebook
} = user.fields;

const { DOC_NAME: DRAFTS } = drafts;
const { DRAFT_TITLE, DRAFT_BODY } = drafts.fields;

const { DOC_NAME: SIGNIN_METHOD } = signInMethod;
const { LOCAL, GOOGLE, FACEBOOK } = signInMethod.enumerators;

const { DOC_NAME: LOCAL_DOC } = local;
const { DOC_NAME: GOOGLE_DOC } = google;
const { DOC_NAME: FACEBOOK_DOC } = facebook;

const { EMAIL: LOCAL_EMAIL, PASSWORD: LOCAL_PASSWORD } = local.fields
const { ID: GOOGLE_ID, EMAIL: GOOGLE_EMAIL } = google.fields
const { ID: FACEBOOK_ID, EMAIL: FACEBOOK_EMAIL } = facebook.fields

class Services {
    static INVALID_ARGUMENT_ERRMSG = 'Data argument is not valid or has one or more invalid properties in it';
    static INVALID_DATA_PARAMETER_PROPERTIES_ERRMSG = 'One or more properties in data parameter are invalid';
    static USER_ALREADY_EXIST_ERRMSG = 'UserAlreadyExistsError';
    static EMAIL_ALREADY_TAKEN_ERRMSG = "This email adress is already in use.";
    static USERNAME_NOT_AVALIABLE_ERRMSG = "User name not avaliable, try a different one.";

    create = async data => {
        try {
            if (!helpers.isObject(data) || helpers.hasInvalidProperty(data))
                throw new TypeError(Services.INVALID_ARGUMENT_ERRMSG);

            let userData = {
                _id: new Types.ObjectId(),
                [USERNAME]: data[USERNAME],
                [DRAFTS]: [],
                [MESSAGE_POOL]: [],
                [RECEIVED]: [],
                [SENT]: [],
                [FAVORITE_MESSAGES]: [],
                [FRIENDS]: [],
                [BLOCKED_USERS]: [],
                [SIGNIN_METHOD]: data[SIGNIN_METHOD],
                [LOCAL_DOC]: {
                    [LOCAL_EMAIL]: data[LOCAL_DOC][LOCAL_EMAIL] || '',
                    [LOCAL_PASSWORD]: data[LOCAL_DOC][LOCAL_PASSWORD] || '',
                },
                [GOOGLE_DOC]: {
                    [GOOGLE_ID]: data[GOOGLE_DOC][GOOGLE_ID] || '',
                    [GOOGLE_EMAIL]: data[GOOGLE_DOC][GOOGLE_EMAIL] || ''
                },
                [FACEBOOK_DOC]: {
                    [FACEBOOK_ID]: data[FACEBOOK_DOC][FACEBOOK_ID] || '',
                    [FACEBOOK_EMAIL]: data[FACEBOOK_DOC][FACEBOOK_EMAIL] || '',
                },
                [LOGIN_ATTEMPTS]: 0,
                [LOGIN_WAITING_TIME]: new Date(),
                [REFRESH_TOKEN]: ''
            };

            let existingUser;

            if (userData[SIGNIN_METHOD] === LOCAL) {
                existingUser = await UserModel.findOne({
                    $or: [
                        { [`${LOCAL_DOC}.${LOCAL_EMAIL}`]: userData[LOCAL_DOC][LOCAL_EMAIL] },
                        { [`${GOOGLE_DOC}.${GOOGLE_EMAIL}`]: userData[LOCAL_DOC][LOCAL_EMAIL] },
                        { [`${FACEBOOK_DOC}.${FACEBOOK_EMAIL}`]: userData[LOCAL_DOC][LOCAL_EMAIL] },
                        { [USERNAME]: userData[USERNAME] }
                    ]
                });
                if (existingUser) {
                    if (existingUser[USERNAME] === userData[USERNAME])
                        throw new Error(Services.USERNAME_NOT_AVALIABLE_ERRMSG);
                    throw new Error(Services.EMAIL_ALREADY_TAKEN_ERRMSG);
                }
            }

            else if (userData[SIGNIN_METHOD] === GOOGLE) {
                existingUser = await UserModel.findOne({
                    $and: [
                        { [SIGNIN_METHOD]: GOOGLE },
                        { [`${GOOGLE_DOC}.${GOOGLE_ID}`]: userData[GOOGLE_DOC][GOOGLE_ID] }
                    ]
                });
                if (existingUser) throw new Error( Services.USER_ALREADY_EXIST_ERRMSG );
            }

            else if (userData[SIGNIN_METHOD] === FACEBOOK) {
                existingUser = await UserModel.findOne({
                    $and: [
                        { [SIGNIN_METHOD]: FACEBOOK },
                        { [`${FACEBOOK_DOC}.${FACEBOOK_ID}`]: userData[FACEBOOK_DOC][FACEBOOK_ID] }
                    ]
                });
                if (existingUser) throw new Error( Services.USER_ALREADY_EXIST_ERRMSG );
            }

            let createdUser = new UserModel(userData);
            await createdUser.save();

            return createdUser;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Services;
