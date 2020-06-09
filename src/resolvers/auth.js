// @ts-check
import controller from "../controllers/auth";
import { Users } from "../models";

/**
 * Authorization resolver
 */
export default {
  Query: {
    me: async (_, __, { access }) => await Users.findOne({ user: access.user }),
  },

  Mutation: {
    signup: (_, args) => controller.signup({ ...args, role: "user" }),
    signin: (_, args) => controller.signin(args),
    signout: (_, __, { access }) => controller.signout(access),
    refreshToken: (_, { refresh, expired }) =>
      controller.refresh(refresh, expired),
    refreshPassword: (_, { password }, { access }) =>
      controller.password(access.user, password),
    unsign: (_, __, { access }) => controller.unsign(access),
  },
};
