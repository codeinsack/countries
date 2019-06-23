import React from "react"

import numeral from 'numeral'

import { Checkbox, TableCell, TableRow, TableBody } from "@material-ui/core"

import { getSorting, stableSort } from "./utils"

export const TableBodyCustom = ({ selected, setSelected, rowsPerPage, page, order, orderBy, countries }) => {
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, countries.length - page * rowsPerPage)
  const sortedCountries = stableSort(countries, getSorting(order, orderBy))

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const isSelected = name => selected.indexOf(name) !== -1

  return (
    <TableBody>
      {sortedCountries
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, index) => {
          const isItemSelected = isSelected(row.name)
          const labelId = `enhanced-table-checkbox-${index}`
          return (
            <TableRow
              hover
              onClick={event => handleClick(event, row.name)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.name}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </TableCell>
              <TableCell component="th" id={labelId} scope="row" padding="none">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.region}</TableCell>
              <TableCell align="right">{numeral(row.area).format("0,0")}</TableCell>
              <TableCell align="right">{numeral(row.population).format("0,0")}</TableCell>
              <TableCell align="right">{row.capital}</TableCell>
            </TableRow>
          )
        })}
      {emptyRows > 0 && (
        <TableRow style={{ height: 49 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </TableBody>
  )
}
