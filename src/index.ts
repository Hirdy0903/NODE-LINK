import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';


async function startServer() {
const port = Number(process.env.PORT) || 3000;
const app = express();
app.use(express.json());//parse json body 

//create graphql server
const server = new ApolloServer({
      typeDefs: `
    type Query {
      hello: String
      say(name:String!): String 
    }
  `,
    resolvers: {
        Query: {
            hello: () => 'hello i am graphql server',
            say: (_,{name}:{name:string}) => `hello ${name} from graphql server`
        }
    }
});
await server.start();
app.use('/graphql', expressMiddleware(server));
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(port,()=>{
    console.log('server started at',port);
}) 
}
 startServer();