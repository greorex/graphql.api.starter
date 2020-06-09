// @ts-check
import storage from "./files/storage";
import { Users, Files, transaction } from "../models";

/**
 * Users controller
 */
export default {
  /**
   * Creates a new user
   * @param {Object} data {user, password, role, ...}
   * @returns {Promise<Object>} a new record
   */
  async create(data) {
    if (await Users.exists({ user: data.user })) {
      throw new Error("already exists");
    }

    const record = new Users({
      ...data,
      createdAt: new Date(),
    });

    return await record.save();
  },

  /**
   * Updates the user
   * @param {Object} data to find and update by id
   * @returns {Promise<Object>} record
   */
  async update({ id, user, ...rest }, record = null) {
    if (!record) {
      record = await Users.findOne({ _id: id }, { _id: 1 });
      if (!record) {
        throw new Error("not found");
      }
    }

    for (const k in rest) {
      record[k] = rest[k];
    }

    record.updatedAt = new Date();

    return await record.save();
  },

  /**
   * Deletes the user with related links
   * @param {*} id internal id
   * @returns {Promise<Boolean>} true if success
   */
  async delete(id) {
    const record = await Users.findById(id, { user: 1 });
    if (!record) {
      throw new Error("not found");
    }

    const files = await Files.find({ owner: record.user }, { _id: 1 });

    return await transaction(async session => {
      await Users.deleteOne(record, { session });

      if (files.length) {
        await Files.deleteMany({ owner: record.user }, { session });
        await storage.deleteMany(files.map(file => file.id));
      }

      return true;
    });
  },
};
