import { name, version } from "./package.json";
import bootstrap from "./src";

console.log(`[${name}] ${version}`);

bootstrap()
  .then(({ url }) => {
    console.log(`[${name}] server is ready at ${url}`);
  })
  .catch(e => {
    console.log("\x1b[31m%s\x1b[0m", `[${name}] server is crashed`);
    console.log(e);

    process.exit(1);
  });
