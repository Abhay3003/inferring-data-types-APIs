/** @format */

import React from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import FileUploader from "./FileUploader"
import ViewFileDetails from "./ViewFileDetails"
import DeletedFile from "./DeletedFile"

function Wrapper() {
  return (
    <div className="app">
      <main className="content">
        <Routes>
          <Route path="/" element={<FileUploader />}></Route>
          <Route
            path="/view-file-details/:id/*"
            element={<ViewFileDetails />}
          ></Route>
          <Route path="/deleted-file" element={<DeletedFile />}></Route>
        </Routes>
      </main>
    </div>
  )
}

export default Wrapper
