const Helpers = require('../helpers');
const helpers = new Helpers();

const { isObject, hasInvalidProperty, signToken } = helpers;

const jwt = require('jsonwebtoken');

describe('isObject function works properly', () => {
    it('Strings are not objects', () => {
        expect(isObject('String')).toBe(false);
    });

    it('Numbers are not objects', () => {
        expect(isObject(1)).toBe(false);
        expect(isObject(0.01)).toBe(false);
    });

    it('Booleans are not objects', () => {
        expect(isObject(true)).toBe(false);
        expect(isObject(false)).toBe(false);
    });

    it('undefined is not an object', () => {
        expect(isObject(undefined)).toBe(false);
    });

    it('null is not a valid object', () => {
        expect(isObject(null)).toBe(false);
    });

    it('Symbols are not objects', () => {
        expect(isObject(Symbol('I\'m a symbol.'))).toBe(false);
    });

    it('Arrays are not objects', () => {
        expect(isObject([1, 2, 3])).toBe(false);
    });

    it('Sets are not objects', () => {
        expect(isObject(new Set([1, 2, 3]))).toBe(false);
    });

    it('functions are not objects', () => {
        expect(isObject(function () { console.log("I'm a function.") })).toBe(false);
    });

    it('It\'s a valid object', () => {
        let myObj = {};
        myObj.toString = () => { return 'custon to string method' };
        expect(isObject(myObj)).toBe(true);
    });
});

describe('hasInvalidProperty function works properly', () => {
    it('Object have invalid Properties', () => {
        expect(hasInvalidProperty({ a: 1 * 'teste', b: 1 })).toBe(true);
        expect(hasInvalidProperty({ a: undefined })).toBe(true);
        expect(hasInvalidProperty({ a: null })).toBe(true);
    });

    it('Object do not have undefined Properties', () => {
        expect(hasInvalidProperty({ a: 0 })).toBe(false);
        expect(hasInvalidProperty({ a: -0 })).toBe(false);
        expect(hasInvalidProperty({ a: false })).toBe(false);
        expect(hasInvalidProperty({ a: '' })).toBe(false);
    });

    it('hasInvalidProperty throws TypeError if parameter type isn\'t a valid object', () => { 
        let nonObjectTypes = [ '', 'String', 0, 1, 0.25, true, false, undefined, null, Symbol('0'), [1, 2, 3 ], new Set([1, 2, 3]), ()=> 'I\'m a function' ]       
        expect(() => hasInvalidProperty('String')).toThrowError( TypeError );
        expect(() => hasInvalidProperty(1)).toThrowError( TypeError );
        expect(() => hasInvalidProperty(0.25)).toThrowError( TypeError );
        expect(() => hasInvalidProperty(true)).toThrowError( TypeError );
        expect(() => hasInvalidProperty(undefined)).toThrowError( TypeError );
        expect(() => hasInvalidProperty(Symbol('I\'m a symbol'))).toThrowError( TypeError );
        expect(() => hasInvalidProperty([1, 2, 3])).toThrowError( TypeError );
        expect(() => hasInvalidProperty(new Set([1, 2, 3]))).toThrowError( TypeError );
        expect(() => hasInvalidProperty(function () { return 'I\'m a function' })).toThrowError( TypeError );
    });
});


describe('signToken function works properly', () => {
    const { ACCESS_TOKEN_SECRET } = require( '../../config' );    
    const id = '10';
    const issuer = 'helpers.signToken.test';
    const expectedSignParam = {
        iss: issuer,
        sub: id,
        iat: expect.any( Number ),
        exp: expect.any( Number )
    };

    it('throws TypeError if parameters type isn\'t string', () => {
        const f = function () { return 'I\'m a function' };        
        expect(() => signToken( 1, 1 )).toThrow( TypeError );
        expect(() => signToken( 0.1, 0.1 )).toThrow( TypeError );
        expect(() => signToken( true, true )).toThrow( TypeError );
        expect(() => signToken( false, false )).toThrow( TypeError );
        expect(() => signToken( undefined, undefined )).toThrow( TypeError );
        expect(() => signToken( null, null )).toThrow( TypeError );
        expect(() => signToken( Symbol('s'), Symbol('s'))).toThrow( TypeError );
        expect(() => signToken( [1,2,3], [1,2,3] )).toThrow( TypeError );
        expect(() => signToken( new Set([1,2,3]),  new Set([1,2,3]))).toThrow( TypeError );
        expect(() => signToken( f,  f ).toThrow( TypeError ));
    });
    
    it('jwt.sign was invoked and returns as expected', () => {
        const spySign = jest.spyOn( jwt, 'sign' );

        signToken( id, issuer );

        expect(spySign).toBeCalled();
        expect(spySign).toBeCalledWith( expectedSignParam, ACCESS_TOKEN_SECRET );
        expect(spySign).toReturn();
        expect(spySign).toReturnWith( expect.any( String ));
    });

    it('return a valid token', ()=>{
        let token = signToken( id, issuer );
        expect( token ).toEqual( expect.any( String ));

        let parts = token.split('.');
        expect( parts ).toHaveLength( 3 );        
    });

});


