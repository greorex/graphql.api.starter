// @ts-check
import controller from "../controllers/files";
import { Files } from "../models";

/**
 * Files resolver
 */
export default {
  Query: {
    files: async () => await Files.find(),
    file: async (_, { id }) => await Files.findById(id),
  },

  Mutation: {
    fileUpload: async (_, { file }, { access }) =>
      controller.upload(await file, access.user),
    fileUpdate: async (_, { id, file }, { access }) =>
      controller.update(id, await file, access.user),
    fileDelete: (_, { id }, { access }) => controller.delete(id, access.user),
  },
};
