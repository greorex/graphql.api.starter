// @ts-check
import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";

/**
 * Factory for custom directive class to control authorization
 *
 * @param {Function} strategy function(role: String, data: Object)
 * @returns {*} class AuthDirective
 */
export default strategy =>
  class AuthDirective extends SchemaDirectiveVisitor {
    visitObject(type) {
      if (!type._authTypeWrapped) {
        type._authTypeWrapped = true;
        Object.entries(type.getFields()).forEach(field => {
          this.wrapField(field, type);
        });
      }

      type._authRole = this.args.requires;
    }

    visitFieldDefinition(field) {
      this.wrapField(field);

      field._authRole = this.args.requires;
    }

    wrapField(field, type) {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async function (...args) {
        const role = field._authRole || (type && type._authRole),
          context = args[2];

        await strategy(role, context);

        return resolve.apply(this, args);
      }.bind(this);
    }
  };
