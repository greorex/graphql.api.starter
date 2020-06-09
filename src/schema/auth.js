// @ts-check
import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User! @auth(requires: USER)
  }

  extend type Mutation {
    signup(user: String!, password: String!): Token!
    signin(user: String!, password: String!): Token!
    refreshToken(refresh: String!, expired: String!): Token!
    refreshPassword(password: String!): Token! @auth(requires: USER)
    signout: Boolean! @auth(requires: USER)
    unsign: Boolean! @auth(requires: USER)
  }

  type Token {
    access: String!
    refresh: String
  }
`;
