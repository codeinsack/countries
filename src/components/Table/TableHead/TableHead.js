import React, { memo } from "react"

import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core"

import { headColumns } from "./constants"

const TableHeadCustom = ({ order, orderBy, selectedRowsCount, rowCount, onRequestSort, onSelectAllClick }) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          indeterminate={selectedRowsCount > 0 && selectedRowsCount < rowCount}
          checked={selectedRowsCount === rowCount}
          onChange={onSelectAllClick}
        />
      </TableCell>
      {headColumns.map(column => (
        <TableCell
          key={column.id}
          align={column.numeric ? "right" : "left"}
        >
          <TableSortLabel
            active={orderBy === column.id}
            direction={order}
            onClick={event => onRequestSort(event, column.id)}
          >
            {column.label}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
)

export default memo(TableHeadCustom)
