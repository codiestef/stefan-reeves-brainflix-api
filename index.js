const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();

const port = 5050;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

function loadVideoData() {
  const videos = JSON.parse(fs.readFileSync("./data/videos.json", "utf8"));
  return videos;
}

function saveVideoData(videos) {
  fs.writeFileSync("./data/videos.json", JSON.stringify(videos, null, 2), 'utf8');
}

app.get("/", (req, res) => {
  res.json({
    message: "Video API running",
  });
});

app.get("/videos", (req, res) => {
  const videos = loadVideoData();

  const minimalVideoInfo = videos.map(video => ({
    id: video.id,
    title: video.title,
    image: video.image
  }));
  res.json(minimalVideoInfo);
});

app.get("/videos/:id", (req, res) => {
  const videos = loadVideoData();
  const foundVideo = videos.find(video => video.id === req.params.id);
  if (foundVideo) {
    res.json(foundVideo);
  } else {
    res.status(404).send("Video not found");
  }
});

app.post("/videos", (req, res) => {
  const videos = loadVideoData();

  const newVideo = {
    id: uuidv4(),
    title: req.body.title,
    channel: req.body.channel || "Default Channel",
    image: req.body.image || "http://localhost:5050/images/[default-image].jpg"
  };

  videos.push(newVideo);
  saveVideoData(videos);

  res.status(201).json(newVideo);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});