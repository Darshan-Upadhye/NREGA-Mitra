import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";
import NregaData from "./models/NregaData.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const RESOURCE_ID = process.env.RESOURCE_ID;
const API_KEY = process.env.API_KEY;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("✅ Connected to MongoDB (NREGA Mitra DB)"));
db.on("error", console.error.bind(console, "❌ MongoDB error:"));

async function fetchAndStoreData() {
  try {
    console.log("⏳ Fetching latest NREGA data from data.gov.in...");

    const baseURL = "https://api.data.gov.in/resource/";
    const limit = 10000;

    const url = `${baseURL}${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=${limit}`;

    const response = await axios.get(url);
    const allData = response.data.records || [];

    if (!allData.length) {
      console.warn("⚠️ No data received from API");
      return;
    }

    const maharashtraData = allData.filter(
      (item) => item.state_name && item.state_name.toUpperCase() === "MAHARASHTRA"
    );

    if (!maharashtraData.length) {
      console.warn("⚠️ No Maharashtra records found in API data");
      return;
    }

    await NregaData.deleteMany({ state_name: "MAHARASHTRA" });
    await NregaData.insertMany(maharashtraData);

    console.log(`✅ Updated ${maharashtraData.length} Maharashtra district records.`);
  } catch (err) {
    console.error("❌ Error fetching API data:", err.message);
  }
}

fetchAndStoreData();

cron.schedule("0 0 * * *", fetchAndStoreData);

app.get("/", (req, res) => res.send("Welcome to NREGA Mitra Backend"));

app.get("/api/nrega", async (req, res) => {
  try {
    const data = await NregaData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/nrega/maharashtra", async (req, res) => {
  try {
    const districts = await NregaData.find({ state_name: "MAHARASHTRA" });
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/nrega/district/:districtName", async (req, res) => {
  try {
    const { districtName } = req.params;
    const districtData = await NregaData.findOne({
      state_name: "MAHARASHTRA",
      district_name: districtName.toUpperCase()
    });

    if (!districtData) {
      return res.status(404).json({ error: "District not found" });
    }

    res.json(districtData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));