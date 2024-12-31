const fs = require("fs");
const path = require("path");

const uploadImageToUploads = async (imageBlobUrl, filename) => {
  const base64Data = imageBlobUrl.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  const filePath = path.join(__dirname, "../uploads", `${filename}.png`);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${filename}.png`; // Return relative path
};

module.exports = { uploadImageToUploads };
