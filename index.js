const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/apply", upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 }
]), (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    skills: req.body.skills,
    cv: req.files['cv'][0].filename,
    coverLetter: req.files['coverLetter'][0].filename
  };

  // Save to a local JSON file (can later be saved to Firebase, MongoDB, etc.)
  const filePath = path.join(__dirname, "applications.json");
  let allData = [];

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath);
    allData = JSON.parse(existing);
  }

  allData.push(data);
  fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));

  res.json({ message: "Application submitted successfully!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
