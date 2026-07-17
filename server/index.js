// const express = require("express");
// const cors = require("cors");
// const ImageKit = require("imagekit");
// const uuid = require("uuid");
// const crypto = require("crypto");

// const app = express();

// app.use(cors());

// const PRIVATE_KEY = "private_IlzJKUjzhkygwpMD0otz4heQqU0=";

// app.get("/auth", (req, res) => {
//   try {
//     const token = uuid.v4();
//     const expire = Math.floor(Date.now() / 1000) + 2400;

//     const signature = crypto
//       .createHmac("sha1", PRIVATE_KEY)
//       .update(token + expire)
//       .digest("hex");

//     res.json({
//       token,
//       expire,
//       signature,
//     });
//   } catch (e) {
//     res.status(500).json({
//       error: e.message,
//     });
//   }
// });

// app.listen(8080, () => {
//   console.log("Server running on port 8080");
// });

const express = require("express");
const cors = require("cors");
const ImageKit = require("imagekit");

const app = express();

app.use(cors());

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

app.get("/auth", (req, res) => {
  try {
    const auth = imagekit.getAuthenticationParameters();
    res.json(auth);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});