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

import getMarks from './arcade.js';

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

const marksType = new GraphQLObjectType({
  name: 'Marks',
  fields: {
    years: { type: new GraphQLNonNull(new GraphQLList(yearType)) }
  }
});

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    isLoggedIn: {
      type: GraphQLBoolean,
      resolve: ({ session }) => session.marks
        || session.isLoggedIn && session.fetchStatus === 100
    },
    getFetchStatus: {
      type: GraphQLInt,
      resolve: ({ session }) => session.fetchStatus || 0
    },
    getMarks: {
      type: new GraphQLNonNull(marksType),
      resolve: ({ session }) => session.marks
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    loginUser: {
      type: GraphQLBoolean,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: ({ session }, { username, password }) => {
        session.fetchStatus = 1;
        try {
          getMarks(username, password, session);
        } catch (_) {
          return false;
        }

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
    // fetchMarks: {
    //   type: new GraphQLNonNull(marksType),
    //   args: {
    //     username: { type: new GraphQLNonNull(GraphQLString) },
    //     password: { type: new GraphQLNonNull(GraphQLString) }
    //   },
    //   resolve: (_, { username, password }) => {
    //     getMarks(username, password);
    //     return testMarks;
    //   }
    // }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });
