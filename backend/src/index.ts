import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import { CustomerResolver } from './resolvers';
import { DataSource } from 'typeorm';

const schema = await buildSchema({
  resolvers: [CustomerResolver],
});

console.log(schema);

export const dataSource = new DataSource({
    type: "sqlite",
    database: "/Users/hagenschupp/Documents/Projects/OrderSystem/backend/database.sql",
    entities: ['./src/types.ts'],
    logging: true,
    synchronize: true,
})

try {
    await dataSource.initialize();
    console.log("Data Source has been initialized!");
} catch (err) {
    console.error("Error during Data Source initialization:", err);
}

const server = new ApolloServer({
  schema,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`🚀  Server ready at: ${url}`);