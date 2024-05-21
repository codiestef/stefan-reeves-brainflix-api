const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();

const port = 5050;

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static("public"));


function loadVideoData() {
  const videos = JSON.parse(fs.readFileSync("./data/video-details.json", "utf8"));
  return videos;
}

function saveVideoData(videos) {
  fs.writeFileSync("./data/video-details.json", JSON.stringify(videos), 'utf8');
}

app.get("/", (req, res) => {
  res.json({
    message: "Video API running!",
  });
});

app.get("/videos", (req, res) => {
  const videos = loadVideoData();

  const minimalVideoInfo = videos.map(video => ({
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
    description: video.description,
    views: video.views,
    likes: video.likes,
    timestamp: video.timestamp,
    comments: video.comments
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
    channel: "Guest",
    image: "http://localhost:5050/images/image0.jpg",
    description: req.body.description,
    views: "0",
    likes: "0",
    duration: "2:30",
    video: "http://localhost:5050/images/image0.jpg",
    timestamp: Date.now(),
    comments: []
  };

  videos.push(newVideo);
  saveVideoData(videos);

  res.status(201).json(newVideo);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

