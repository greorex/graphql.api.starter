// @ts-check
import { gql } from "apollo-server-express";
import auth from "./auth";
import users from "./users";
import files from "./files";

const link = gql`
  scalar Date
  scalar Upload

  directive @auth(requires: Role = USER) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [link, auth, users, files];
