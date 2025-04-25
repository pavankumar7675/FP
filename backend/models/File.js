// const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema({
//   filename: {
//     type: String,
//     required: true,
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now,
//   },
//   size: {
//     type: Number,
//     required: true,
//   },
//   path: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model("File", fileSchema);

const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  path: {
    type: String,
  },
  size: Number,
  driveFileId: String,  // Google Drive file ID
  uploadDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model("File", FileSchema)