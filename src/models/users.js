// @ts-check
import crypto from "crypto";
import validator from "validator";
import { v4 as uuid } from "uuid";

const hashPassword = password =>
  crypto.createHash("sha512").update(password).digest("hex");

/**
 * Users model
 */
export default mongoose => {
  const schema = new mongoose.Schema({
    user: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: value =>
          validator.isEmail(value) || validator.isMobilePhone(value),
        message: ({ value }) =>
          `${value} is not a valid e-mail or mobile phone!`,
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      maxlength: 20,
    },

    role: {
      type: String,
      required: true,
    },

    loggedAt: Date,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  });

  schema.pre("save", function (next) {
    if (this.password) {
      this.password = hashPassword(this.password);
    }

    next();
  });

  schema.statics.loggedIn = async function ({ user }) {
    return this.findOne(
      {
        user,
        loggedAt: { $ne: null },
        deletedAt: null,
      },
      {
        user: 1,
        role: 1,
        loggedAt: 1,
      }
    );
  };

  schema.statics.findByLogin = async function ({ user, password }) {
    return this.findOne(
      {
        user,
        password: hashPassword(password),
        deletedAt: null,
      },
      {
        user: 1,
        role: 1,
        loggedAt: 1,
      }
    );
  };

  return mongoose.model("User", schema);
};
