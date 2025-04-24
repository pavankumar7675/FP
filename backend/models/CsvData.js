const mongoose = require("mongoose")

const CsvDataSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  rows: { type: Array, default: [] }
})

module.exports = mongoose.model("CsvData", CsvDataSchema)