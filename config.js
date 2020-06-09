import "dotenv/config";

const production = process.env.NODE_ENV === "production";

export default {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 8080,
    production: production ? true : false,
  },

  admin: {
    user: process.env.ADMIN_INIT_USER || "admin@example.com",
    password: process.env.ADMIN_INIT_PASSWORD || "password",
  },

  auth: {
    algorithm: process.env.ALGORITHM || "HS256",
    secret: process.env.SECRET || "authorizationsecret",
    expiresIn: 60 * 10,
    refreshSecret: process.env.REFRESH_SECRET || "refreshsecret",
    refreshExpiresIn: "1h",
    lookup: true,
    roles: {
      admin: process.env.ROLE_ADMIN_SECRET || "roleadminsecret",
      user: process.env.ROLE_USER_SECRET || "roleusersecret",
    },
  },

  grapql: {
    path: process.env.GRAPHQL_PATH || "/api",
    options: {
      introspection: true,
      playground: true,
    },
  },

  mongo: {
    url: process.env.MONGO_URL || "mongodb://localhost:27017",
    options: {
      auth: {
        user: process.env.MONGO_INITDB_ROOT_USERNAME || "admin",
        password: process.env.MONGO_INITDB_ROOT_PASSWORD || "password",
      },
      dbName: process.env.MONGO_INITDB_DATABASE || "starter",
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    },
  },

  storage: {
    path: process.env.STORAGE_PATH || "uploads",
  },
};
