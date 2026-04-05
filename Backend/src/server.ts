import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchVirusTotal } from "./virustotal.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  try {

    const { indicator, type } = req.body;

    const data = await fetchVirusTotal(indicator, type);

    res.json({
      source: "VirusTotal",
      data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch VirusTotal data"
    });

  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});