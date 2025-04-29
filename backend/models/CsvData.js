// const mongoose = require("mongoose")

// const csvDataSchema = new mongoose.Schema({
//   fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
//   rows: [mongoose.Schema.Types.Mixed],
// })

// module.exports = mongoose.model("CsvData", csvDataSchema)


const mongoose = require("mongoose")

const CsvDataSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  rows: { type: Array, default: [] }
})

module.exports = mongoose.model("CsvData", CsvDataSchema)