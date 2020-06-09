// @ts-check
import path from "path";
import storage from "./storage";
import { Files, transaction } from "../../models";

/**
 * Files controller
 */
export default {
  /**
   * Creates a new file
   * @param {Object} file
   * @param {String} owner
   * @returns {Promise<Object>} a new record
   */
  async upload(file, owner) {
    const { createReadStream, filename, mimetype } = file,
      ext = path.extname(filename),
      name = path.basename(filename, ext);

    if (await Files.exists({ name, ext, owner })) {
      throw new Error("already exists");
    }

    const record = new Files({
      name,
      ext,
      mimetype,
      owner,
      createdAt: new Date(),
    });

    const { id } = record,
      { size } = await storage.write(createReadStream(), id);

    record.size = size;

    try {
      await record.save();
    } catch (e) {
      await storage.delete(id);
      throw e;
    }

    return record;
  },

  /**
   * Prepare link to download
   * @param {*} id internal id
   * @returns {Promise<Object>} a link to download
   */
  async download(id) {
    const record = await Files.findById(id, { ext: 1, name: 1 });

    return !record
      ? null
      : {
          filename: `${record.name}${record.ext}`,
          createReadStream: () => storage.read(id),
        };
  },

  /**
   * Updates the record
   * @param {*} id internal id
   * @param {Object} file
   * @param {String} owner
   * @returns {Promise<Object>} record
   */
  async update(id, file, owner) {
    const { createReadStream } = file,
      record = await Files.findById(id, { owner: 1 });

    if (!record) {
      throw new Error("not found");
    }

    if (record.owner !== owner) {
      throw new Error("access denied");
    }

    const { size } = await storage.write(createReadStream(), id);

    record.size = size;
    record.updatedAt = new Date();

    return await record.save();
  },

  /**
   * Deletes the record and file
   * @param {*} id internal id
   * @param {String} owner
   * @returns {Promise<Boolean>} true if success
   */
  async delete(id, owner) {
    const record = await Files.findById(id, { owner: 1 });

    if (!record) {
      throw new Error("not found");
    }

    if (record.owner !== owner) {
      throw new Error("access denied");
    }

    return await transaction(async session => {
      await Files.deleteOne(record, { session });
      await storage.delete(id);

      return true;
    });
  },
};
