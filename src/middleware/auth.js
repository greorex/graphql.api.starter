// @ts-check
import auth from "../controllers/auth/strategy";

/**
 * Checks authorization by strategy
 * @param {Object} request
 * @returns {Promise<Object>} token payload
 */
export const authorization = async request => {
  const token = auth.extract(request);

  if (!token) {
    return {}; // anonymous
  }

  const access = await auth.decode(token);

  auth.verify(access);

  if (!(await auth.logged(access))) {
    throw new Error("not authorized");
  }

  return access;
};

/**
 * Express middleware to control authorization
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {*} result of next
 */
export default () => async (request, response, next) => {
  try {
    request.access = await authorization(request);
  } catch (e) {
    response.status(400).send(e).end();
  }

  return next();
};
