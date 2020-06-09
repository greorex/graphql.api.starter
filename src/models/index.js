// @ts-check
import mongoose from "mongoose";
import users from "./users";
import files from "./files";

// mongoose/issues/6890
mongoose.set("useCreateIndex", true);

// init models
export const Users = users(mongoose);
export const Files = files(mongoose);

/**
 * Starts action with transaction
 * @param {Function} action async function (session)
 * @returns {Promise<*>} result returned by action
 */
export const transaction = async action => {
  const session = await mongoose.startSession();

  let result;

  try {
    await session.withTransaction(
      async () => {
        result = await action(session);
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (e) {
    throw e;
  } finally {
    await session.endSession();
  }

  return result;
};

/**
 * Creates database connection
 * @async
 *
 * @param {Object} config
 * @param {String} config.url connection string
 * @param {Object} config.options options (see mongoose.connect)
 * @returns {Promise<mongoose>} connected mongoose
 */
export default async ({ url, options }) => {
  return mongoose.connect(url, options);
};
