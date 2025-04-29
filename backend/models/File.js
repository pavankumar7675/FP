// const mongoose = require("mongoose")

// const fileSchema = new mongoose.Schema({
//   filename: String,
//   originalname: String,
//   mimetype: String,
//   size: Number,
//   uploadDate: { type: Date, default: Date.now },
// })

// module.exports = mongoose.model("File", fileSchema)

const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  driveFileId: String,  // Google Drive file ID
  uploadDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model("File", FileSchema)