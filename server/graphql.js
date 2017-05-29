import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLString,
      resolve: () => 'Username'
    },
    viewerData: {
      type: userType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { username, email, password }) => ({ username, email, password })
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUserAndLogIn: {
      type: userType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { username, email, password }) => ({ username, email, password })
    }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });