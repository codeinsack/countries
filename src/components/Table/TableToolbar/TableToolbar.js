import React from "react"

import { IconButton, Toolbar, Tooltip, Typography } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import FilterListIcon from "@material-ui/icons/FilterList"

const TableToolbar = ({ selectedRowsCount }) => (
  <Toolbar>
    {selectedRowsCount > 0
      ? (
        <>
          <Typography>
            {selectedRowsCount} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )
      : (
        <>
          <Typography>
            Countries
          </Typography>
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
  </Toolbar>
)

export default TableToolbar
