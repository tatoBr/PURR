`O TypeError é ativado quando um
operador ou argumento passado para
uma função é incompativel com
o tipo esperado por esse operador ou função.`
module.exports = {
    errorMessages: {
        
    },   
    httpStatusCode:{
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    },
    globals: {
        DEFAULT_LOGIN_WAIT_TIME: 1000 * 60 * 3,
        SALT_ROUNDS: 12
    },
    models:{
        user: {
            MODEL_NAME:'User',
            properties:{               
                USERNAME: 'username',
                EMAIL: 'email',
                PASSWORD: 'password',
                GOOGLE_ID: 'google_id',
                FACEBOOK_ID: 'faceboo_id',             
                signUpMethod: {
                    DOC_NAME: 'signUpMethod',
                    enumerators: {
                        LOCAL: 'local',
                        GOOGLE: 'google',
                        FACEBOOK: 'facebook'
                    }
                },
                drafts: {
                    DOC_NAME: 'drafts',
                    fields: {
                        TITLE: 'title',
                        BODY: 'body'
                    }
                },
                MESSAGE_POOL: 'messagePool',
                RECEIVED: 'received',
                SENT: 'sent',
                FAVORITE_MESSAGES: 'favoriteMessages',
                FRIENDS: 'friends',
                BLOCKED_USERS: 'blockedUsers',
                LOGIN_ATTEMPTS: 'loginAttempts',
                LOGIN_WAITING_TIME:'loginWaitingTime',
                REFRESH_TOKEN: 'refreshToken'
            },
        },
        message:{
            MODEL_NAME: 'Message',
            fields:{
                TITLE: 'title',
                BODY: 'body',
                AUTHOR: 'author',
                EXPIRES_AT: 'expiresAt',
                meta: {
                    DOC_NAME: 'meta',
                    fields: {
                        HEARTUP:'heartUp',
                        HEARTDOWN:'heartDown',
                        FAVORED:'favored',
                        TAGS: 'tags'
                    }
                }
            }
        }
    }    
}