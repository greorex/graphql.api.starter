// @ts-check
import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    files: [File] @auth(requires: USER)
    file(id: ID!): File! @auth(requires: USER)
  }

  extend type Mutation {
    fileUpload(file: Upload!): File! @auth(requires: USER)
    fileUpdate(id: ID!, file: Upload!): File! @auth(requires: USER)
    fileDelete(id: ID!): Boolean! @auth(requires: USER)
  }

  type File @auth(requires: USER) {
    id: ID!
    name: String!
    ext: String!
    mimetype: String!
    size: Int!
    owner: String!
  }
`;
