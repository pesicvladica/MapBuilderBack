const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/map_markers");

const MarkerSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  altitude: Number,
  note: String,
});

const Marker = mongoose.model("Marker", MarkerSchema);

app.post("/save-markers", async (req, res) => {
  await Marker.deleteMany({}); // Clear previous markers
  const markers = await Marker.insertMany(req.body.markers);
  res.json({ success: true, markers });
});

app.get("/load-markers", async (req, res) => {
  const markers = await Marker.find();
  res.json({ markers });
});

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Map Marker Manager API is running...");
});

app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use, trying a different one...`
      );
      const server = app.listen(0, () => {
        const newPort = server.address().port;
        console.log(`Server started on port ${newPort}`);
      });
    } else {
      console.error(err);
    }
  });