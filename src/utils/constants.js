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
            fields:{               
                USERNAME: 'username',                
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
                signInMethod: {
                    DOC_NAME: 'signInMethod',
                    enumerators: {
                        LOCAL: 'local',
                        GOOGLE: 'google',
                        FACEBOOK: 'facebook'
                    }
                },
                local:{
                    DOC_NAME: 'local',
                    fields: {
                        EMAIL: 'email',
                        PASSWORD: 'password'
                    }
                },
                google:{
                    DOC_NAME: 'gloogle',
                    fields: {
                        ID: '_id',
                        EMAIL: 'email',                        
                    }
                },
                facebook:{
                    DOC_NAME: 'facebook',
                    fields: {
                        ID: '_id',
                        EMAIL: 'email',                        
                    }
                },
                LOGIN_ATTEMPTS: 'loginAttempts',
                LOGIN_WAITING_TIME:'loginWaitingTime',
                REFRESH_TOKEN: 'refreshToken'
            }
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