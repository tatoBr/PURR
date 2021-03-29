const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Services = require('../../users');
const services = new Services();

const UserModel = require( '../../../models/user' );
const Helpers = require( '../../../utils/helpers' )

const { custon_error_messages, globals, models: { user, message } } = require('../../../utils/constants');
const { EMAIL, USERNAME, PASSWORD, MESSAGE_POOL, RECEIVED, SENT, FAVORITE_MESSAGES, FRIENDS, BLOCKED_USERS, LOGIN_ATTEMPTS, LOGIN_WAITING_TIME, REFRESH_TOKEN, drafts } = user.fields;
const { DOC_NAME: DRAFTS } = drafts;
const { TITLE, BODY } = drafts.fields;
const options = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };

const TEST_TIMEOUT = 1000 * 30;

describe('user Services.prototype.create() works properly',() => {
    const spiedIsObject = jest.spyOn( Helpers.prototype, 'isObject' );
    const spiedHasInvalidProperty = jest.spyOn( Helpers.prototype, 'hasInvalidProperty');
    const spiedModelFindOne = jest.spyOn( UserModel, 'findOne' );
    const spiedModelSave = jest.spyOn( UserModel.prototype, 'save' );

    beforeEach(()=>{        
        spiedIsObject.mockClear();
        spiedHasInvalidProperty.mockClear();
        spiedModelFindOne.mockClear();
        spiedModelSave.mockClear();
    })
    
    beforeAll( async() => {        
        try {            
            return await mongoose.connect( global.__MONGO_URI__, options );        
        } catch (error) {
            console.log( error );
        }
    });

    afterAll( async ()=>{
        try {
            await mongoose.connection.close( true );       
            
        } catch (error) {
            console.log( error );
        }
    });
    
    let userData = {
        [EMAIL]: 'email@teste.com',
        [USERNAME]: 'testUser',
        [PASSWORD]: 'abc123',
        [DRAFTS]: [],
        [MESSAGE_POOL]: [],
        [RECEIVED]: [],
        [SENT]: [],
        [FAVORITE_MESSAGES]: [],
        [FRIENDS]: [],
        [BLOCKED_USERS]: [],
        [LOGIN_ATTEMPTS]: 0,
        [LOGIN_WAITING_TIME]: new Date().toISOString(),
        [REFRESH_TOKEN]: ''
    };

    it('throws TypeError if data argument isn\'t a valid object.', async() => {        
        let invalidTypes = [ '', 'String', 0, 1, 1.25, true, false, null, undefined, Symbol('s'), [], [1, 2, 3], new Set([]), new Set([1, 2, 3]), NaN]
        for( let t of invalidTypes ){
            await expect( async() => await services.create( t ))
            .rejects.toThrowError( TypeError );

            expect( spiedIsObject ).toBeCalledTimes( 1 );
            expect( spiedIsObject ).toBeCalledWith( t );
            expect( spiedIsObject ).toReturnWith( false );

            expect( spiedHasInvalidProperty ).not.toBeCalled();
            expect( spiedModelFindOne ).not.toBeCalled();
            expect( spiedModelSave ).not.toBeCalled();
            
            spiedIsObject.mockClear()           
        }
    });

    it('throws TypeError if user data has invalid properties', async() => {        
        let properties = Object.keys( userData );
        let length = properties.length;
        let invalidTypes = [ null, undefined, NaN ];

        for( let t of invalidTypes ){
            let rdnIdx = Math.floor( Math.random() * length );
            let userDataWithInvalidParams = { ...userData };
            
            let rdnKey = properties[ rdnIdx ];
            userDataWithInvalidParams[ rdnKey ] = t;
            
            await expect( async() => await services.create( userDataWithInvalidParams ))
            .rejects
            .toThrowError( TypeError );

            expect( spiedIsObject ).toBeCalledTimes( 1 );
            expect( spiedIsObject ).toBeCalledWith( userDataWithInvalidParams );
            expect( spiedIsObject ).toReturnWith( true );

            expect( spiedHasInvalidProperty ).toBeCalledTimes( 1 );
            expect( spiedHasInvalidProperty ).toBeCalledWith( userDataWithInvalidParams );
            expect( spiedHasInvalidProperty ).toReturnWith( true );

            expect( spiedModelFindOne ).not.toBeCalled();
            expect( spiedModelSave ).not.toBeCalled();

            spiedIsObject.mockClear();
            spiedHasInvalidProperty.mockClear();
        }        
    });        
    
    it('save user successfully',async() => {        
        const filter = { $or:[{[EMAIL]: userData[EMAIL]},{[USERNAME]: userData[USERNAME]}]}
        let createdUser = await services.create( userData );

        expect( createdUser ).not.toBeFalsy();
        expect( createdUser ).toBeInstanceOf( mongoose.Model );

        expect( spiedIsObject ).toBeCalledTimes( 1 );
        expect( spiedIsObject ).toBeCalledWith( userData );
        expect( spiedIsObject ).toReturnWith( true );

        expect( spiedHasInvalidProperty ).toBeCalledTimes( 1 );
        expect( spiedHasInvalidProperty ).toBeCalledWith( userData );
        expect( spiedHasInvalidProperty ).toReturnWith( false );
        
        expect( spiedModelFindOne ).toBeCalledTimes( 1 );
        expect( spiedModelFindOne ).toBeCalledWith( filter );
        expect( spiedModelFindOne ).toReturnTimes( 1 );
        expect( spiedModelFindOne ).toReturnWith( expect.any( mongoose.Query )) 

        expect( spiedModelSave ).toBeCalledTimes( 1 );        
        expect( spiedModelSave ).toReturnTimes( 1 );       
    });
    
    it('throws error when user email already exists', async()=>{
        const filter = { $or:[{[EMAIL]: userData[EMAIL]},{[USERNAME]: userData[USERNAME]}]}
        
        await expect(async() => await services.create( userData ))
        .rejects.toThrowError( Services.EMAIL_ALREADY_TAKEN_ERRMSG );

        expect( spiedIsObject ).toBeCalledTimes( 1 );
        expect( spiedIsObject ).toBeCalledWith( userData );
        expect( spiedIsObject ).toReturnWith( true );

        expect( spiedHasInvalidProperty ).toBeCalledTimes( 1 );
        expect( spiedHasInvalidProperty ).toBeCalledWith( userData );
        expect( spiedHasInvalidProperty ).toReturnWith( false );
        
        expect( spiedModelFindOne ).toBeCalledTimes( 1 );
        expect( spiedModelFindOne ).toBeCalledWith( filter );
        expect( spiedModelFindOne ).toReturnTimes( 1 );
        expect( spiedModelFindOne ).toReturnWith( expect.any( mongoose.Query )) 

        expect( spiedModelSave ).not.toBeCalled();
    });

    it('throws error when user email already exists', async()=>{
        let userDataWithDifferentEmail = { ...userData }
        userDataWithDifferentEmail[EMAIL] = 'another_email@gmail.com';

        const filter = { $or:[{[EMAIL]: userDataWithDifferentEmail[EMAIL]},{[USERNAME]: userDataWithDifferentEmail[USERNAME]}]}
        await expect(async() => await services.create( userDataWithDifferentEmail ))
        .rejects.toThrowError( Services.USERNAME_NOT_AVALIABLE_ERRMSG );

        expect( spiedIsObject ).toBeCalledTimes( 1 );
        expect( spiedIsObject ).toBeCalledWith( userDataWithDifferentEmail );
        expect( spiedIsObject ).toReturnWith( true );

        expect( spiedHasInvalidProperty ).toBeCalledTimes( 1 );
        expect( spiedHasInvalidProperty ).toBeCalledWith( userDataWithDifferentEmail );
        expect( spiedHasInvalidProperty ).toReturnWith( false );
        
        expect( spiedModelFindOne ).toBeCalledTimes( 1 );
        expect( spiedModelFindOne ).toBeCalledWith( filter );
        expect( spiedModelFindOne ).toReturnTimes( 1 );
        expect( spiedModelFindOne ).toReturnWith( expect.any( mongoose.Query )) 

        expect( spiedModelSave ).not.toBeCalled();
    });
});


