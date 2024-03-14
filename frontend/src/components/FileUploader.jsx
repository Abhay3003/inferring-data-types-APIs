/** @format */

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Typography, useTheme } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles"

import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  Box,
} from "@material-ui/core"
import { Link} from "react-router-dom"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

const FileUploader = () => {
  const theme = useTheme()
  const [allFiles, setAllFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadMessage, setUploadMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const classes = useStyles()

  const getAllFiles = async () => {
    const response = await fetch("http://localhost:8000/file/", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.status === 200) {
      const data = await response.json()
      setAllFiles(data)
      console.log(data)
    } else {
      setUploadMessage( "Something went wrong please try again");
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    setSelectedFile(file)
    setUploadMessage("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      if (response.status === 200) {
        setUploadMessage("File uploaded successfully!")
        window.location.reload()
      } else {
        setUploadMessage(
          response.data || "Error uploading file. Please try again."
        )
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadMessage("Error uploading file. Please try again." + error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    getAllFiles()
    console.log(allFiles)
  }, [])

  return (
    <>
      <Box sx={{ p: 1 }}>
      <Typography variant="h5" margin={'40px 0px 10px 10px'}>
        Upload your file
      </Typography>
      
      <form onSubmit={handleSubmit} margin="20px">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload File"}
        </button>
        <p>{uploadMessage}</p>
      </form>
      </Box>
      <Typography variant="h6" margin={'40px 0px 10px 10px'}>
        Files
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>File Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFiles.map((file, index) => (
              <TableRow key={file.file_name}>
                <TableCell>{index + 1}</TableCell>{" "}
                {/* Add 1 for row numbering */}
                <TableCell>{file.file_name}</TableCell>
                <TableCell>
                  <Button variant="text" color="primary" style={{fontSize: '12px'}}>
                    <Link to={`/view-file-details/${file.id}`}>View Details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default FileUploader
