const { Router } = require( 'express' );
const passport = require( 'passport' );

const { validateBody, schemas} = require( '../middlewares/validator' );

const { jwtStrategy, localStrategy } = require( '../utils/strategies' );

passport.use( jwtStrategy );
passport.use( localStrategy );

const UserController = require( '../controllers/users' );
const userController = new UserController();

const router = Router();

router.post( '/signup', validateBody(schemas.subscribe), userController.signUp );

router.get( '/signin' ,validateBody( schemas.signIn ), passport.authenticate('local', { session: false }), ( req, res ) => userController.signIn );

module.exports = router;