import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { startStandaloneServer } from '@apollo/server/standalone';
import type { Book, Resolvers } from './gql/resolvers-types';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

const typeDefs = gql(
  readFileSync('schema.graphql', {
    encoding: 'utf-8',
  })
);

const books: Book[] = [
  {
    id: randomUUID().toString(),
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: randomUUID().toString(),
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers: Resolvers = {
  Query: {
    getBooks: (): Book[] => books,
    getBook: (parent, args, contextValue, info): Book => books.find(book => book.title === args.title) as Book
  },
  Mutation: {
    updateBook: (parent, args, contextValue, info): Book => {
      const book = books.find(book => book.id == args.id);
      if (!!book) {
        book.title = args.title;
        book.author = args.author;
        return book;
      } else {
        throw new Error(`No book with ID ${args.id} found`);
      }
    },
    createBook: (parent, args, contextValue, info): Book => {
      const book = {
        id: randomUUID().toString(),
        title: args.title,
        author: args.author,
      }

      books.push(book);

      return book;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`🚀  Server ready at: ${url}`);