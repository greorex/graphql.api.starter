import config from "../config";
import express from "express";
import apollo from "./middleware/apollo";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import mongoose, { Users } from "./models";
import routes from "./routes";

export default async () => {
  const { server, mongo, grapql, admin } = config,
    app = express();

  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(compression());

  if (!server.production) {
    app.use(morgan("dev"));
  }

  if (grapql) {
    await apollo(app, grapql);
  }

  app.use("/", routes);
  app.use("/*", (_, response) => response.status(404).end());

  if (mongo) {
    await mongoose(mongo);

    if (admin && !(await Users.exists({ user: admin.user })))
      await new Users({
        ...admin,
        role: "admin",
        createdAt: new Date(),
      }).save();
  }

  return new Promise((resolve, reject) => {
    const { port, host } = server;

    app
      .listen(port, host)
      .on("error", e => reject(e))
      .on("listening", () => resolve({ url: `http://${host}:${port}` }));
  });
};
