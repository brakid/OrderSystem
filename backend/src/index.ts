import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { startStandaloneServer } from '@apollo/server/standalone';
import type { Book, Resolvers } from './gql/resolvers-types';
import { readFileSync } from 'fs';

const typeDefs = gql(
  readFileSync('schema.graphql', {
    encoding: 'utf-8',
  })
);

const books: Book[] = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers: Resolvers = {
  Query: {
    books: (): Book[] => books,
    book: (parent, args, contextValue, info): Book => books.find(book => book.title === args.title) as Book
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`🚀  Server ready at: ${url}`);