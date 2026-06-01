import { Router, Request, Response } from "express";
import multer from "multer";
import { processBulkCsv } from "../services/lead.bulk.service";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(), // keep file in RAM as Buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.match(/\.csv$/i)) {
      return cb(new Error("Only .csv files are accepted"));
    }
    cb(null, true);
  },
});

router.post(
  "/bulk",
  upload.single("file"), // field name in the form-data
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No CSV file uploaded. Use field name 'file'." });
    }

    try {
      const { results, summary } = await processBulkCsv(req.file.buffer);
      return res.json({ summary, results });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return res.status(422).json({ error: message });
    }
  },
);

export default router;
