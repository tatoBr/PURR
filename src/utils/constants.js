`O TypeError é ativado quando um
operador ou argumento passado para
uma função é incompativel com
o tipo esperado por esse operador ou função.`
module.exports = {
    errorMessages: {
        
    },   
    httpStatusCode:{
        OK: 200,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    },
    globals: {
        DEFAULT_LOGIN_WAIT_TIME: 1000 * 60 * 3
    },
    models:{
        user: {
            MODEL_NAME:'User',
            fields:{
                EMAIL: 'email',
                USERNAME: 'username',
                PASSWORD: 'password',
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