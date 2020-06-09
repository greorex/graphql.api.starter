// @ts-check
import auth from "../schema/directives/auth";
import strategy from "../controllers/auth/strategy";
import typeDefs from "../schema";
import resolvers from "../resolvers";
import { authorization } from "./auth";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";

/**
 * Sets apollo server as Express middleware
 * @async
 *
 * @param {Object} app Express application instance
 * @param {Object} config
 * @param {String} config.path graphql request path
 * @param {Object} config.options options (see ApolloServer)
 * @returns {Promise<ApolloServer>} ApolloServer instance
 */
export default async (app, config) =>
  new Promise(resolve => {
    const apollo = new ApolloServer({
      ...config.options,
      schema: makeExecutableSchema({
        typeDefs,
        resolvers,
        schemaDirectives: {
          auth: auth((role, { access }) => {
            if (!strategy.access(role, access.secret)) {
              throw new Error("access denied");
            }
          }),
        },
      }),
      context: async ({ req }) => {
        const access = await authorization(req);

        return {
          access,
        };
      },
    });

    apollo.applyMiddleware({ app, path: config.path });

    resolve(apollo);
  });
