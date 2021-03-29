module.exports = class ServerResponse{
    static COMMON_ERROR_MSG = 'Something Went Wrong.';
    static PATH_NOT_FOUND_MSG = 'You took a wrong path. Comeback, There\'s nothing to see here.';
    static INVALID_REQUEST_DATA_MSG = 'The request body is not valid and can\'t be processed by the server within this route.';
    static INVALID_REQUEST_PROPERTY_MSG = 'The request body has one or more invalid properties and can\'t be properly processed by the server.';
    static USERDATA_ALREADY_EXISTS_MSG = 'Email or user name already in use. Try again with different email or user  or try to login with the existing user.'
    static EMAIL_IN_USE_MSG = 'This email is already in use. Try again with a different email or log in with the existing account.';
    static USERNAME_TAKEN_MSG = 'Username already taken. Try a differente one.'
    static USER_SAVED_SUCCESSFULLY = 'User was successfully created' 
    static USER_SUCCESSFULLY_LOGGEDIN = 'User\'s credential are valid and it successfully logged in the system.'   

    constructor( message, content = null ){
        this.message = message;
        this.content = content;
    }
};