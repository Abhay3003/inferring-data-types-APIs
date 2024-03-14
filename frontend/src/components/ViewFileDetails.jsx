/** @format */

import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  detailsContainer: {
    margin: theme.spacing(2),
    padding: theme.spacing(3),
  },
  detailsTitle: {
    marginBottom: theme.spacing(3),
  },
  dataTypeCell: {
    fontWeight: "bold",
  },
}))

const ViewFileDetails = ({ fileId }) => {
  const [fileDetails, setFileDetails] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const id = useParams().id
  const classes = useStyles()
  var [dataTypes, setDataTypes] = useState({})

  const fetchFileDetails = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch(`http://localhost:8000/file/${id}/`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
      if (response.status === 200) {
        const data = await response.json()
        console.log(data.details)
        setFileDetails(data.details)
        setFileName(data.file.file_name)
        setDataTypes(data.details.data_types)
      }
    } catch (error) {
      console.error("Error fetching file details:", error)
      setErrorMessage("Failed to load file details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeTo = (event, dataType) => {
    setDataTypes({ ...dataTypes, [dataType]: event.target.value })
  }

  const deleteFile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/delete-file/${id}/`, {
        method: "DELETE",
      })
      if (response.status === 204) {
        console.log("File Deleted successfully")
        setTimeout(2000)
        window.location.href = "/deleted-file"
      } else {
        console.error("Failed to delete file:", response.data.error)
        setErrorMessage("Failed to delete file. Please try again.")
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
      setErrorMessage("Failed to delete file. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateDataTypes = async () => {
    console.log({ data_types: dataTypes })
    try {
      const response = await fetch(
        `http://localhost:8000/update-data-types/${id}/`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ data_types: dataTypes }),
        }
      )

      if (response.status === 200) {
        console.log("Data types updated successfully.")
        window.location.reload()
      } else {
        console.error("Failed to update data types:", response.data.error)
        setErrorMessage("Failed to update data types. Please try again.")
      }
    } catch (error) {
      console.error("Error updating data types:", error)
      setErrorMessage("Failed to update data types. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchFileDetails()
  }, [fileId])

  const displayDetails = () => {
    if (isLoading) {
      return (
        <Grid container justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      )
    }

    if (errorMessage) {
      return (
        <Typography variant="body2" color="error">
          {errorMessage}
        </Typography>
      )
    }

    if (!fileDetails) {
      return null
    }

    return (
      <Card className={classes.detailsContainer}>
        <CardContent>
          <Typography variant="h6" className={classes.detailsTitle}>
            File Details
            <Typography align="right">
              <Button
                variant="contained"
                color="secondary"
                disabled={isLoading}
                onClick={deleteFile}
              >
                Delete File
              </Button>
            </Typography>
          </Typography>
          <Typography className={classes.detailsTitle}>
            <Grid item xs={6}>
              <Typography variant="body2">
                File ID: {fileDetails.parent_file}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">File Name: {fileName}</Typography>
            </Grid>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Data Types</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.dataTypeCell}>
                        Column Name
                      </TableCell>
                      <TableCell className={classes.dataTypeCell}>
                        Data Type
                      </TableCell>
                      <TableCell className={classes.dataTypeCell}>
                        Change To
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(fileDetails.data_types).map(
                      ([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                          <TableCell>
                            <FormControl className={classes.changeToSelect}>
                              <InputLabel
                                id={`${key}-select-label`}
                              ></InputLabel>
                              <Select
                                labelId={`${key}-select-label`}
                                value={dataTypes[key]}
                                onChange={(event) => handleChangeTo(event, key)}
                              >
                                <MenuItem value="String">String</MenuItem>
                                <MenuItem value="DateTime">DateTime</MenuItem>
                                <MenuItem value="Integer">Integer</MenuItem>
                                <MenuItem value="Float">Float</MenuItem>
                                <MenuItem value="Categorical Values">
                                  Categorical Values
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Typography align="right">
            <Button
              variant="contained"
              color="primary"
              disabled={isLoading}
              onClick={updateDataTypes}
            >
              Update Data Types
            </Button>
          </Typography>
          {errorMessage && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}
        </CardContent>
      </Card>
    )
  }

  return <div>{displayDetails()}</div>
}

export default ViewFileDetails
