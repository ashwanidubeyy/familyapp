import * as functions from "firebase-functions";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_jtCM3WDSdJq+hqETvmRU21GVr7g=",
  privateKey: "private_IlzJKUjzhkygwpMD0otz4heQqU0=",
  urlEndpoint: "https://ik.imagekit.io/okhxbviyq",
});

export const imageKitAuth = functions.https.onRequest((_req, res) => {
  try {
    const auth = imagekit.getAuthenticationParameters();
    res.status(200).json(auth);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate authentication parameters",
    });
  }
});
