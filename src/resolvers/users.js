// @ts-check
import controller from "../controllers/users";
import { Users, Files } from "../models";

/**
 * User resolver
 */
export default {
  Query: {
    users: async () => await Users.find(),
    user: async (_, { id }) => await Users.findById(id),
  },

  User: {
    files: async ({ user }) => await Files.find({ owner: user }),
  },

  Mutation: {
    userCreate: (_, { input }) => controller.create(input),
    userUpdate: (_, { id, input }) => controller.update({ _id: id, ...input }),
    userDelete: (_, { id }) => controller.delete(id),
  },
};
