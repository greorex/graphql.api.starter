// @ts-check
import auth from "./strategy";
import controller from "../users";

/**
 * Authorization controller
 */
export default {
  /**
   * Creates a new account
   * @param {Object} data - {user, password, role, ...}
   * @returns {Promise<Object>} authorization token
   */
  async signup(data) {
    return auth.token(
      await controller.create({
        ...data,
        loggedAt: new Date(),
      })
    );
  },

  /**
   * Authorization by account
   * @param {Object} data {user, password}
   * @returns {Promise<Object>} authorization token
   */
  async signin(data) {
    const account = await auth.validate(data);

    return auth.token(
      await controller.update({ loggedAt: new Date() }, account)
    );
  },

  /**
   * New authorization by refresh token
   * @param {String} refresh token
   * @param {String} expired access token
   * @returns {Promise<Object>} authorization token
   */
  async refresh(refresh, expired) {
    const { payload } = await auth.refresh(refresh, expired),
      account = await auth.logged(payload);

    return auth.token(
      await controller.update({ loggedAt: new Date() }, account)
    );
  },

  /**
   * Sets a new password
   * @param {String} user
   * @param {String} password
   * @returns {Promise<Object>} authorization token
   */
  async password(user, password) {
    const account = await auth.logged({ user });

    return auth.token(
      await controller.update(
        {
          password,
          loggedAt: new Date(),
        },
        account
      )
    );
  },

  /**
   * Marks account as unauthorized
   * @param {Object} data - {user}
   * @returns {Promise<Boolean>} true if success
   */
  async signout(data) {
    const account = await auth.logged(data);

    await controller.update({ loggedAt: null }, account);

    return true;
  },

  /**
   * Marks account as unsigned (deleted)
   * @param {Object} data - {user}
   * @returns {Promise<Boolean>} true if success
   */
  async unsign(data) {
    const account = await auth.logged(data);

    await controller.update({ loggedAt: null, deletedAt: new Date() }, account);

    return true;
  },
};
