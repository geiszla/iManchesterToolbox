import { GraphQLBoolean, GraphQLObjectType, GraphQLSchema } from 'graphql';
// import { GraphQLNonNull, GraphQLString } from 'graphql';

// const userType = new GraphQLObjectType({
//   name: 'User',
//   fields: {
//     username: { type: new GraphQLNonNull(GraphQLString) },
//     email: { type: new GraphQLNonNull(GraphQLString) },
//     password: { type: new GraphQLNonNull(GraphQLString) }
//   }
// });

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    isLoggedIn: {
      type: GraphQLBoolean,
      resolve: ({ session }) => session.isLoggedIn === true
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    loginUser: {
      type: GraphQLBoolean,
      resolve: ({ session }) => {
        session.isLoggedIn = true;
        return session.isLoggedIn;
      }
    },
    logoutUser: {
      type: GraphQLBoolean,
      resolve: ({ session }) => {
        session.isLoggedIn = false;
        return session.isLoggedIn;
      }
    }
    // addUserAndLogIn: {
    //   type: userType,
    //   args: {
    //     username: { type: new GraphQLNonNull(GraphQLString) },
    //     email: { type: new GraphQLNonNull(GraphQLString) },
    //     password: { type: new GraphQLNonNull(GraphQLString) }
    //   },
    //   resolve: (root, { username, email, password }) => ({ username, email, password })
    // }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });
