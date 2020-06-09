// @ts-check
import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User!] @auth(requires: ADMIN)
    user(id: ID!): User! @auth(requires: ADMIN)
  }

  extend type Mutation {
    userCreate(user: UserInput!): User! @auth(requires: ADMIN)
    userUpdate(id: ID!, user: UserInput!): User! @auth(requires: ADMIN)
    userDelete(id: ID!): Boolean! @auth(requires: ADMIN)
  }

  type User @auth(requires: USER) {
    id: ID! @auth(requires: ADMIN)
    user: String!
    role: String
    createdAt: Date @auth(requires: ADMIN)
    updatedAt: Date @auth(requires: ADMIN)
    loggedAt: Date
    deletedAt: Date @auth(requires: ADMIN)
    files: [File]
  }

  input UserInput {
    password: String!
    role: String!
  }
`;
