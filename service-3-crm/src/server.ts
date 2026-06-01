import express from "express";
import dotenv from "dotenv";
import supabase from "./db/supabase";
import cors from "cors";

import leadRoutes from "./routes/lead.routes";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("CRM Service Running");
});

app.get("/test-db", async (req, res) => {

    const { data, error } = await supabase
        .from("leads")
        .select("*");

    if (error) {
        return res.json(error);
    }

    res.json(data);
});

app.use("/lead", leadRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = Number(process.env.PORT) || 5003;

const server = app.listen(PORT, () => {
    console.log(`CRM Service running on port ${PORT}`);
});

server.on("error", (err) => {
    console.error("Server Error:", err);
});