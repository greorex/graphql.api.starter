// @ts-check
import { Router } from "express";
import auth from "../middleware/auth";
import controller from "../controllers/files";

const router = Router();

router.use(auth());

router.get("/download/:id", async ({ params: { id } }, response) => {
  try {
    const file = await controller.download(id);

    if (!file) {
      return response.status(404).send("not found").end();
    }

    const { filename, createReadStream } = file;

    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );

    const stream = createReadStream();

    stream.pipe(response);
    stream.on("error", e => {
      throw e;
    });

    response.status(200).end();
  } catch (e) {
    response.status(500).send(e).end();
  }
});

export default router;
