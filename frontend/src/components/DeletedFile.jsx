/** @format */

import React from "react"
import { useNavigate } from "react-router-dom"
import { Typography, Box } from "@material-ui/core"

const DeletedFile = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 2000)
  }, [])
  return (
    <Box align="center">
      <Typography variant="h5">
        File was deleted successfully. You will be redirected
      </Typography>
    </Box>
  )
}
export default DeletedFile
