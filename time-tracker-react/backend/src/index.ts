import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readCsv } from "./utils/utils.js";

const app = express();
const PORT = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Example route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node backend!");
});

// route: /data (all) OR /data/:cycleId (filtered)
app.get(["/time-entries", "/time-entries/:cycleId"], async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/sample.csv");
    const rows = await readCsv(filePath);

    const { cycleId } = req.params;

    if (cycleId) {
      // filter where row.cycleId === cycleId
      const filtered = rows.filter((row) => row.cycleId === cycleId);
      return res.json(filtered);
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read CSV file" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
