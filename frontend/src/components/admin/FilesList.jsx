import { formatDistanceToNow } from "date-fns";
import "./FilesList.css";

function FilesList({ files, selectedFile, onSelectFile, onDeleteFile }) {
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  return (
    <div className="files-list">
      <h2>Your CSV Files</h2>
      {files.length === 0 ? (
        <div className="no-files">
          <p>No files uploaded yet</p>
        </div>
      ) : (
        <ul>
          {files.map((file) => (
            <li
              key={file._id}
              className={selectedFile === file._id ? "selected" : ""}
              onClick={() => onSelectFile(file._id)}
            >
              <div className="file-info">
                <div className="file-icon">
                  <i className="fas fa-file-csv"></i>
                </div>
                <div className="file-details">
                  <h3>{file.filename}</h3>
                  <p>{file.uploadDate ? formatDate(file.uploadDate) : "No upload date"}</p>
                </div>
              </div>
              <div className="file-actions">
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file._id);
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilesList;