import { useState, useEffect } from "react"
import "./DataViewer.css"
import axios from "axios"
function DataViewer({ fileId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRow, setNewRow] = useState({})

  useEffect(() => {
    if (fileId) {
      fetchData()
    }
  }, [fileId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/files/${fileId}`)
      setData(response.data) ;
      console.log("abbu",JSON.stringify(response.data))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCellEdit = (rowIndex, column, value) => {
    setEditingCell({ rowIndex, column })
    setEditValue(value)
  }

  const handleCellUpdate = async () => {
    if (!editingCell) return

    const { rowIndex, column } = editingCell
    const updatedRow = { ...data.rows[rowIndex] }
    updatedRow[column] = editValue

    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}/rows/${rowIndex}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
      })

      if (response.ok) {
        // Update local state
        const updatedRows = [...data.rows]
        updatedRows[rowIndex] = updatedRow
        setData({ ...data, rows: updatedRows })
      }
    } catch (error) {
      console.error("Error updating cell:", error)
    }

    setEditingCell(null)
    setEditValue("")
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const handleDeleteRow = async (rowIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}/rows/${rowIndex}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Update local state
        const updatedRows = data.rows.filter((_, index) => index !== rowIndex)
        setData({ ...data, rows: updatedRows })
      }
    } catch (error) {
      console.error("Error deleting row:", error)
    }
  }

  const handleAddRow = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}/rows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      })

      if (response.ok) {
        // Update local state
        const updatedRows = [...data.rows, newRow]
        setData({ ...data, rows: updatedRows })
        setShowAddForm(false)
        setNewRow({})
      }
    } catch (error) {
      console.error("Error adding row:", error)
    }
  }

  const handleNewRowChange = (column, value) => {
    setNewRow({ ...newRow, [column]: value })
  }

  if (loading) {
    return (
      <div className="data-viewer loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    )
  }

  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <div className="data-viewer empty">
        <p>No data available for this file</p>
      </div>
    )
  }

  const headers = Object.keys(data.rows[0])

  return (
    <div className="data-viewer">
      <div className="data-header">
        <h2>CSV Data</h2>
        <button
          className="add-row-button"
          onClick={() => {
            const emptyRow = {}
            headers.forEach((header) => {
              emptyRow[header] = ""
            })
            setNewRow(emptyRow)
            setShowAddForm(true)
          }}
        >
          Add Row
        </button>
      </div>

      {showAddForm && (
        <div className="add-row-form">
          <h3>Add New Row</h3>
          <div className="form-fields">
            {headers.map((header) => (
              <div key={header} className="form-field">
                <label>{header}</label>
                <input
                  type="text"
                  value={newRow[header] || ""}
                  onChange={(e) => handleNewRowChange(header, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="cancel-button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button className="save-button" onClick={handleAddRow}>
              Add Row
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`}>
                    {editingCell && editingCell.rowIndex === rowIndex && editingCell.column === header ? (
                      <div className="edit-cell">
                        <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
                        <div className="edit-actions">
                          <button className="save-edit" onClick={handleCellUpdate}>
                            <i className="fas fa-check"></i>
                          </button>
                          <button className="cancel-edit" onClick={handleCellCancel}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="cell-content" onClick={() => handleCellEdit(rowIndex, header, row[header])}>
                        {row[header]}
                      </div>
                    )}
                  </td>
                ))}
                <td className="actions-cell">
                  <button className="delete-row" onClick={() => handleDeleteRow(rowIndex)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataViewer
