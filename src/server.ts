
// You will NOT have the any env variables for 
// this repo, you must make your own configurations
// for reproduction

require('dotenv').config();

// port 
const _PORT = process.env.PORT || 4562;

// modules
import  express                                   from 'express';
import  mongoose                                  from 'mongoose';
import  { ApolloServer }                          from 'apollo-server-express';

// TypeDefs
import  typeDefs                                  from './server_modules/schemas/typeDefs';
// Resolvers 
import  resolvers                                 from './server_modules/schemas/rootResolver';
// Authentication Middleware
import  authenicationMiddleware                   from './server_modules/middleware/authenicationMiddleware';


// apollo server that will typeDefs, resolvers, and schema, and any other middleware
const initApollo = new ApolloServer({
    typeDefs /* Type Definitions Here */,
    resolvers /* Resolvers Here */,
    context: authenicationMiddleware, /* Middleware Here */
})


// connection to DB
mongoose.connect(`mongodb+srv://${process.env.UN}:${process.env.PW}@cluster0.zb3af.mongodb.net/${process.env.DB}?retryWrites=true&w=majority` || `http://localhost:${_PORT}`, async () => {

    console.log(`connected to ${process.env.DB}`)

    const server = express();
    await initApollo.start();
    initApollo.applyMiddleware({ app: server });


    server.listen(_PORT, () => {
        console.log(`🚀 Server is running with no issues, click here to open http://localhost:${_PORT}/graphql`);
    });

})
