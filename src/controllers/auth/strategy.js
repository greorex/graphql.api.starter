// @ts-check
import jwt from "./jwt";
import config from "../../../config";
import { Users } from "../../models";

const { roles } = config.auth;

/**
 * Authorization strategy
 */
export default {
  /**
   * Extracts token from request
   * @param {Request} request
   * @returns {String} token
   */
  extract({ headers }) {
    return (
      headers["x-token"] ||
      headers["x-access-token"] ||
      headers["authorization"]
    );
  },

  /**
   * Decodes token by JWT
   * @param {String} token
   * @returns {Promise<Object>} access payload
   */
  async decode(token) {
    return jwt.access(
      token.startsWith("Bearer ") ? token.slice(7, token.length) : token
    );
  },

  /**
   * Verifies access from token
   * @param {String} access
   * @returns throws error
   */
  verify(access) {
    if (!access) {
      throw new Error("invalid authorization");
    }

    if (access === "TokenExpiredError") {
      throw new Error("authorization expired");
    }
  },

  /**
   * Checks access by role
   * @param {String} role to test
   * @param {String} secret from token payload
   */
  access(role, secret) {
    return !role ||
      secret === roles.admin ||
      secret === roles[role.toLowerCase()]
      ? true
      : false;
  },

  /**
   * Creates access token
   * @param {Object} params
   * @param {String} params.user
   * @param {String} params.role
   * @returns {Object} access token by JWT
   */
  token({ user, role }) {
    return jwt.signin({
      user,
      secret: roles[role === "admin" ? role : "user"],
    });
  },

  /**
   * Decodes refresh token
   * @param {String} refresh token
   * @param {String} expired access token
   * @returns {Promise<Object>} access token by JWT
   */
  async refresh(refresh, expired) {
    const token = await jwt.refresh(refresh);

    this.verify(token);

    if (!(token && token.access === expired)) {
      throw new Error("invalid authorization");
    }

    return token;
  },

  /**
   * Ensure user can login
   * @param {Object} data - {user, password}
   * @returns {Promise<Object>} record
   */
  async validate(data) {
    const account = await Users.findByLogin(data);

    if (!account) {
      throw new Error("invalid account");
    }

    return account;
  },

  /**
   * Ensure account is logged
   * @param {Object} data - {user}
   * @returns {Promise<Object>} record
   */
  async logged(data) {
    const account = await Users.loggedIn(data);

    if (!account) {
      throw new Error("not authorized");
    }

    return account;
  },
};
