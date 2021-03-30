if( process.env.NODE_ENV !== 'production' )
    require('dotenv').config();

const app = require('./src/app');
const { PORT } = require( './src/config' )

app.listen(PORT, console.log(`server listening on Port ${ PORT }`));