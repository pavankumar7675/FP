import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import FileUploader from "./FileUploader"
import FilesList from "./FilesList"
import DataViewer from "./DataViewer"
import "./Dashboard.css"
import axios from "axios"

function Dashboard() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchFiles()
  }, [refreshTrigger])

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/files")
      const data = response.data
      console.log("arr",response.data)

      setFiles(data)
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }

  const handleFileUpload = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleFileSelect = (fileId) => {
    setSelectedFile(fileId)
  }

  const handleFileDelete = async (fileId) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFiles(files.filter((file) => file._id !== fileId))
        if (selectedFile === fileId) {
          setSelectedFile(null)
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h1>CSV Admin Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-left">
            <FileUploader onUploadSuccess={handleFileUpload} />
            <FilesList
              files={files}
              selectedFile={selectedFile}
              onSelectFile={handleFileSelect}
              onDeleteFile={handleFileDelete}
            />
          </div>
          <div className="dashboard-right">
            {selectedFile ? (
              <DataViewer fileId={selectedFile} />
            ) : (
              <div className="no-file-selected">
                <p>Select a file to view and edit its data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard