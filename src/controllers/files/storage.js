// @ts-check
import path from "path";
import fs from "fs";
import config from "../../../config";
import { v4 as uuid } from "uuid";

const { storage } = config;

/**
 * Local storage helper
 */
export default {
  /**
   * Creates reading stream to get file by uid
   * @param {String} uid
   * @returns {Object} ReadStream to read from
   */
  read(uid) {
    return fs.createReadStream(path.join(storage.path, uid));
  },

  /**
   * Writes file by stream to storage
   * @param {Object} stream ReadStream to write from
   * @param {String} uid optional, uuid v4 by default
   * @returns {Promise<Object>} {uid, size}
   */
  async write(stream, uid = uuid()) {
    return new Promise((resolve, reject) => {
      const location = path.join(storage.path, uid),
        write = fs.createWriteStream(location);

      stream.pipe(write);
      stream.on("error", e => reject(e));
      write.on("finish", () =>
        resolve({
          uid,
          size: fs.statSync(location).size,
        })
      );
    });
  },

  /**
   * Removes file by uid from storage
   * @param {String} uid
   * @returns {Promise<Boolean>} true if success
   */
  async delete(uid) {
    return new Promise((resolve, reject) => {
      fs.unlink(path.join(storage.path, uid), e => {
        !e ? resolve(true) : reject(e);
      });
    });
  },

  /**
   * Removes files by uids from storage
   * @param {Array<String>} uids list of files to remove
   * @returns {Promise<Boolean>} true if success
   */
  async deleteMany(uids) {
    return new Promise((resolve, reject) => {
      let i = uids.length;

      for (const uid of uids) {
        fs.unlink(path.join(storage.path, uid), e => {
          if (e) {
            reject(e);
          } else if (--i <= 0) {
            resolve(true);
          }
        });
      }
    });
  },
};
