const { Router } = require( 'express' );
const { validateBody, schemas} = require( '../middlewares/validator' );

const UserController = require( '../controllers/users' );
const userController = new UserController();

const passport = require( 'passport' );
const { jwtStrategy, localStrategy } = require( '../utils/strategies' );

passport.use( jwtStrategy );
passport.use( localStrategy );

const router = Router();

router.post(
    '/signup',
    validateBody( schemas.signUp ),
    userController.signUp
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