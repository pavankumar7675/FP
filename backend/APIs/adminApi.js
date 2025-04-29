// const express = require("express")
// const multer = require("multer")
// const { Readable } = require("stream")
// const csv = require("csv-parser")
// const File = require("../../models/File")
// const CsvData = require("../../models/CsvData")

// const router = express.Router()

// // Set up multer for file uploads
// const storage = multer.memoryStorage()
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
//       cb(null, true)
//     } else {
//       cb(new Error("Only CSV files are allowed"))
//     }
//   },
// })

// // Upload CSV File
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" })
//     }

//     const file = new File({
//       filename: req.file.originalname,
//       originalname: req.file.originalname,
//       mimetype: req.file.mimetype,
//       size: req.file.size,
//     })
//     await file.save()

//     const results = []
//     const bufferStream = new Readable()
//     bufferStream.push(req.file.buffer)
//     bufferStream.push(null)

//     await new Promise((resolve, reject) => {
//       bufferStream
//         .pipe(csv())
//         .on("data", (data) => results.push(data))
//         .on("end", resolve)
//         .on("error", reject)
//     })

//     const csvData = new CsvData({ fileId: file._id, rows: results })
//     await csvData.save()

//     res.status(201).json({ message: "File uploaded successfully", fileId: file._id })
//   } catch (error) {
//     console.error("Error uploading file:", error)
//     res.status(500).json({ error: "Failed to upload file" })
//   }
// })

// // Get All Files
// router.get("/files", async (req, res) => {
//   try {
//     const files = await File.find().sort({ uploadDate: -1 })
//     res.json(files)
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch files" })
//   }
// })

// // Get File Data
// router.get("/files/:id", async (req, res) => {
//   try {
//     const csvData = await CsvData.findOne({ fileId: req.params.id })
//     if (!csvData) return res.status(404).json({ error: "File data not found" })
//     res.json(csvData)
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch file data" })
//   }
// })

// // Delete File
// router.delete("/files/:id", async (req, res) => {
//   try {
//     await File.findByIdAndDelete(req.params.id)
//     await CsvData.findOneAndDelete({ fileId: req.params.id })
//     res.json({ message: "File deleted successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete file" })
//   }
// })

// // Add a Row
// router.post("/files/:id/rows", async (req, res) => {
//   try {
//     const result = await CsvData.findOneAndUpdate({ fileId: req.params.id }, { $push: { rows: req.body } }, { new: true })
//     if (!result) return res.status(404).json({ error: "File data not found" })
//     res.json({ message: "Row added successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add row" })
//   }
// })

// // Update a Row
// router.put("/files/:id/rows/:rowIndex", async (req, res) => {
//   try {
//     const updatePath = `rows.${req.params.rowIndex}`
//     const updateObj = {}
//     updateObj[updatePath] = req.body

//     const result = await CsvData.findOneAndUpdate({ fileId: req.params.id }, { $set: updateObj }, { new: true })
//     if (!result) return res.status(404).json({ error: "File data not found" })
//     res.json({ message: "Row updated successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update row" })
//   }
// })

// // Delete a Row
// router.delete("/files/:id/rows/:rowIndex", async (req, res) => {
//   try {
//     const csvData = await CsvData.findOne({ fileId: req.params.id })
//     if (!csvData) return res.status(404).json({ error: "File data not found" })

//     csvData.rows.splice(parseInt(req.params.rowIndex), 1)
//     await csvData.save()

//     res.json({ message: "Row deleted successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete row" })
//   }
// })

// module.exports = router





// const express = require("express")
// const { Readable } = require("stream")
// const csv = require("csv-parser")
// const multer = require("multer")
// const File = require("../../models/File")
// const CsvData = require("../../models/CsvData")

// const router = express.Router()
// const storage = multer.memoryStorage()
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
//       cb(null, true)
//     } else {
//       cb(new Error("Only CSV files are allowed"))
//     }
//   },
// })

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" })

//     const file = new File({
//       filename: req.file.originalname,
//       originalname: req.file.originalname,
//       mimetype: req.file.mimetype,
//       size: req.file.size,
//     })
//     await file.save()

//     const results = []
//     const bufferStream = new Readable()
//     bufferStream.push(req.file.buffer)
//     bufferStream.push(null)

//     await new Promise((resolve, reject) => {
//       bufferStream
//         .pipe(csv())
//         .on("data", (data) => results.push(data))
//         .on("end", resolve)
//         .on("error", reject)
//     })

//     const csvData = new CsvData({ fileId: file._id, rows: results })
//     await csvData.save()

//     res.status(201).json({ message: "File uploaded successfully", fileId: file._id })
//   } catch (error) {
//     console.error("Error uploading file:", error)
//     res.status(500).json({ error: "Failed to upload file" })
//   }
// })

// router.get("/files", async (req, res) => {
//   try {
//     const files = await File.find().sort({ uploadDate: -1 })
//     res.json(files)
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch files" })
//   }
// })

// router.get("/files/:id", async (req, res) => {
//   try {
//     const csvData = await CsvData.findOne({ fileId: req.params.id })
//     if (!csvData) return res.status(404).json({ error: "File data not found" })
//     res.json(csvData)
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch file data" })
//   }
// })

// router.delete("/files/:id", async (req, res) => {
//   try {
//     await File.findByIdAndDelete(req.params.id)
//     await CsvData.findOneAndDelete({ fileId: req.params.id })
//     res.json({ message: "File deleted successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete file" })
//   }
// })

// router.post("/files/:id/rows", async (req, res) => {
//   try {
//     const result = await CsvData.findOneAndUpdate({ fileId: req.params.id }, { $push: { rows: req.body } }, { new: true })
//     if (!result) return res.status(404).json({ error: "File data not found" })
//     res.json({ message: "Row added successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add row" })
//   }
// })

// router.put("/files/:id/rows/:rowIndex", async (req, res) => {
//   try {
//     const updatePath = `rows.${req.params.rowIndex}`
//     const updateObj = {}
//     updateObj[updatePath] = req.body

//     const result = await CsvData.findOneAndUpdate({ fileId: req.params.id }, { $set: updateObj }, { new: true })
//     if (!result) return res.status(404).json({ error: "File data not found" })
//     res.json({ message: "Row updated successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update row" })
//   }
// })

// router.delete("/files/:id/rows/:rowIndex", async (req, res) => {
//   try {
//     const csvData = await CsvData.findOne({ fileId: req.params.id })
//     if (!csvData) return res.status(404).json({ error: "File data not found" })

//     csvData.rows.splice(parseInt(req.params.rowIndex), 1)
//     await csvData.save()

//     res.json({ message: "Row deleted successfully" })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete row" })
//   }
// })

// module.exports = router



const express = require("express")
const { Readable } = require("stream")
const csv = require("csv-parser")
const multer = require("multer")
const fs = require("fs")
const { google } = require("googleapis")
const File = require("../models/File")
 const CsvData = require("../models/CsvData")

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Load Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: "serviceAccountKey.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"]
})// Upload CSV File to Google Drive
async function uploadToDrive(fileBuffer, filename, mimetype) {
  try {
    const fileMetadata = { name: filename, parents: [DRIVE_FOLDER_ID] }
    const media = { mimeType: mimetype, body: Readable.from(fileBuffer) }

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id"
    })

    return response.data.id
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error)
    throw error
  }
}

// Upload CSV File
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })

    // Validate file type
    if (!req.file.originalname.endsWith(".csv")) {
      return res.status(400).json({ error: "Only CSV files are allowed" })
    }

    // Upload to Google Drive
    const driveFileId = await uploadToDrive(req.file.buffer, req.file.originalname, req.file.mimetype)

    // Save file details in MongoDB
    const file = new File({
      filename: req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      driveFileId
    })
    await file.save()

    // Parse CSV data
    const results = []
    const bufferStream = new Readable()
    bufferStream.push(req.file.buffer)
    bufferStream.push(null)

    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject)
    })

    // Save CSV data
    const csvData = new CsvData({ fileId: file._id, rows: results })
    await csvData.save()

    res.status(201).json({ message: "File uploaded successfully", fileId: file._id })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ error: "Failed to upload file" })
  }
})
const drive = google.drive({ version: "v3", auth })

// Google Drive Folder ID (Set Your Folder ID)
const DRIVE_FOLDER_ID = "1DPhnK6_9vx9gclErTyVnwHF7QBk_gWFb"

// Upload CSV File to Google Drive
async function uploadToDrive(fileBuffer, filename, mimetype) {
  const fileMetadata = { name: filename, parents: [DRIVE_FOLDER_ID] }
  const media = { mimeType: mimetype, body: Readable.from(fileBuffer) }

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id"
  })

  return response.data.id
}

// Upload CSV File
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })

    // Upload to Google Drive
    const driveFileId = await uploadToDrive(req.file.buffer, req.file.originalname, req.file.mimetype)

    // Save file details in MongoDB
    const file = new File({
      filename: req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      driveFileId
    })
    await file.save()

    // Parse CSV data
    const results = []
    const bufferStream = new Readable()
    bufferStream.push(req.file.buffer)
    bufferStream.push(null)

    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject)
    })

    // Save CSV data
    const csvData = new CsvData({ fileId: file._id, rows: results })
    await csvData.save()

    res.status(201).json({ message: "File uploaded successfully", fileId: file._id })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ error: "Failed to upload file" })
  }
})

// Get All Files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 })
    res.json(files)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files" })
  }
})

// Get Specific File Data
router.get("/files/:id", async (req, res) => {
  try {
    const csvData = await CsvData.findOne({ fileId: req.params.id })
    if (!csvData) return res.status(404).json({ error: "File data not found" })
    res.json(csvData)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch file data" })
  }
})

// Delete File (From MongoDB + Google Drive)
router.delete("/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
    if (!file) return res.status(404).json({ error: "File not found" })

    // Delete from Google Drive
    await drive.files.delete({ fileId: file.driveFileId })

    // Delete from MongoDB
    await File.findByIdAndDelete(req.params.id)
    await CsvData.findOneAndDelete({ fileId: req.params.id })

    res.json({ message: "File deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file" })
  }
})

// Add a Row to CSV Data
router.post("/files/:id/rows", async (req, res) => {
  try {
    const result = await CsvData.findOneAndUpdate(
      { fileId: req.params.id },
      { $push: { rows: req.body } },
      { new: true }
    )
    if (!result) return res.status(404).json({ error: "File data not found" })
    res.json({ message: "Row added successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to add row" })
  }
})

// Update a Row
router.put("/files/:id/rows/:rowIndex", async (req, res) => {
  try {
    const updatePath = `rows.${req.params.rowIndex}`
    const updateObj = {}
    updateObj[updatePath] = req.body

    const result = await CsvData.findOneAndUpdate(
      { fileId: req.params.id },
      { $set: updateObj },
      { new: true }
    )
    if (!result) return res.status(404).json({ error: "File data not found" })
    res.json({ message: "Row updated successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to update row" })
  }
})

// Delete a Row
router.delete("/files/:id/rows/:rowIndex", async (req, res) => {
  try {
    const csvData = await CsvData.findOne({ fileId: req.params.id })
    if (!csvData) return res.status(404).json({ error: "File data not found" })

    csvData.rows.splice(parseInt(req.params.rowIndex), 1)
    await csvData.save()

    res.json({ message: "Row deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete row" })
  }
})

module.exports = router