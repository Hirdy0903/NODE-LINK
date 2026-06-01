import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import { prismaClient } from './lib/db.js';
async function startServer() {
    const port = Number(process.env.PORT) || 3000;
    const app = express();
    app.use(express.json());
    const typeDefs = `
    type Query {
      hello: String
      say(name: String!): String
    }

    type Mutation {
      createuser(email: String!, firstName: String!, lastName: String!): Boolean
    }
  `;
    const resolvers = {
        Query: {
            hello: () => 'hello i am graphql server',
            say: (_, { name }) => `hello ${name} from graphql server`,
        },
        Mutation: {
            createuser: async (_, { email, firstName, lastName }) => {
                await prismaClient.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        password: 'random-password',
                        salt: 'randomsalt',
                    },
                });
                return true;
            },
        },
    };
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    app.get('/', (req, res) => {
        res.json({ message: 'Hello World' });
    });
    app.listen(port, () => {
        console.log('server started at', port);
    });
}
startServer();
//# sourceMappingURL=index.js.map