// @ts-check
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Files model
 */
export default mongoose => {
  const schema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    ext: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
    },

    owner: {
      type: String,
      required: true,
    },

    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  });

  schema.plugin(mongoosePaginate);

  return mongoose.model("File", schema);
};
