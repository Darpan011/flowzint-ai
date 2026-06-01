import express from "express";
import cors from "cors"; // ✅ correct package

import leadRoutes from "./routes/lead.routes";
import leadBulkRoute from "./routes/lead.bulk.route";

const app = express();

// ✅ Middlewares FIRST — before any routes
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Service 1 Running");
});

app.use("/lead", leadRoutes); // existing
app.use("/leads", leadRoutes); // ✅ also serve same routes under /leads
app.use("/leads", leadBulkRoute);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
