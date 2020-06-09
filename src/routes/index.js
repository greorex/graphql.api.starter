// @ts-check
import { Router } from "express";
import files from "./files";

const router = Router();

router.use("/file", files);

export default router;
