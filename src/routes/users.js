const { Router } = require( 'express' );
const { validateBody, schemas} = require( '../middlewares/validator' );

const UserController = require( '../controllers/users' );
const userController = new UserController();

const passport = require( 'passport' );
const { jwtStrategy, localStrategy, oAuthStrategy } = require( '../utils/strategies' );

passport.use( jwtStrategy );
passport.use( localStrategy );
passport.use( oAuthStrategy );

const router = Router();

router.post(
    '/signup',
    validateBody( schemas.signUp ),
    userController.signUp
);

router.get(
    '/signup/oauth/google',
    passport.authenticate('google-plus-token', { session: false }),
    ( req, res ) => res.json({ message: 'OAuth2 área', content: req.user})
);

router.get( 
    '/signin',
    validateBody( schemas.signIn ),
    passport.authenticate('local', { session: false }),
    userController.signIn
);



router.get(
    '/main',
    passport.authenticate('jwt', { session: false }),
    ( req, res ) => res.json({ message: 'Secret area', content: req.user})
);


module.exports = router;