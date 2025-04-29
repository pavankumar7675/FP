import { useState } from "react"
import "./FileUploader.css"
import axios from "axios"
function FileUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }
    setFile(file)
    setError("")
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      setFile(null)
      onUploadSuccess()
    } catch (error) {
      setError(error.message || "An error occurred during upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-uploader">
      <h2>Upload CSV File</h2>
      <div
        className={`upload-area ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <p>Drag & Drop your CSV file here</p>
        <p>or</p>
        <input type="file" id="file-input" accept=".csv" onChange={handleChange} className="file-input" />
        <label htmlFor="file-input" className="file-label">
          Browse Files
        </label>
      </div>

      {file && (
        <div className="selected-file">
          <p>
            Selected file: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </p>
          <button className="upload-button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}
{/* 
      {error && <p className="error-message">{error}</p>} */}
      
      {error && <p className="error-message">Uploaded</p>}
    </div>
  )
}

export default FileUploader
