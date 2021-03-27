const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

module.exports = {
    uri: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.o77px.${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
    options:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true              
    }
};