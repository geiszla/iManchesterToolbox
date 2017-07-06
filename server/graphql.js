import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

const testMarks = require('./test.json');

const sessionType = new GraphQLObjectType({
  name: 'Session',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    weighting: { type: new GraphQLNonNull(GraphQLInt) },
    denominator: { type: new GraphQLNonNull(GraphQLInt) },
    value: { type: GraphQLFloat },
    isEstimated: { type: new GraphQLNonNull(GraphQLBoolean) },
    isExpected: { type: new GraphQLNonNull(GraphQLBoolean) },
    isLate: { type: new GraphQLNonNull(GraphQLBoolean) }
  }
});

const classType = new GraphQLObjectType({
  name: 'Class',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    semester: { type: GraphQLInt },
    type: { type: GraphQLString },
    isFinal: { type: new GraphQLNonNull(GraphQLBoolean) },
    weight: { type: GraphQLInt },
    total: { type: GraphQLFloat },
    isInProgress: { type: GraphQLBoolean },
    marked: { type: GraphQLFloat },
    sessions: { type: new GraphQLNonNull(new GraphQLList(sessionType)) }
  }
});

const subjectType = new GraphQLObjectType({
  name: 'Subject',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    classes: { type: new GraphQLNonNull(new GraphQLList(classType)) }
  }
});

const yearType = new GraphQLObjectType({
  name: 'Year',
  fields: {
    number: { type: new GraphQLNonNull(GraphQLInt) },
    schoolYear: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
    subjects: { type: new GraphQLNonNull(new GraphQLList(subjectType)) }
  }
});

// const marksType = new GraphQLObjectType({
//   name: 'Marks',
//   fields: {
//     years: { type: new GraphQLNonNull(new GraphQLList(yearType)) }
//   }
// });

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    isLoggedIn: {
      type: GraphQLBoolean,
      // resolve: ({ session }) => session.isLoggedIn === true
      resolve: () => true
    },
    getMarks: {
      type: new GraphQLNonNull(yearType),
      resolve: () => testMarks.years[0]
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
