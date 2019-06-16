import { useStore } from "effector-react"
import React, { useEffect, useState, useCallback } from "react"

import { Table, TablePagination, Paper, LinearProgress } from "@material-ui/core"

import { $countries, fetchAllCountries, loadCountries } from "../../model/countries"

import TableHead from "./TableHead"
import TableBody from "./TableBody"
import TableToolbar from "./TableToolbar"

const TableCustom = () => {
  const countries = useStore($countries)
  const isCountriesLoading = useStore(loadCountries.pending)
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    fetchAllCountries()
  }, [])

  const handleRequestSort = useCallback((event, property) => {
    const isDesc = orderBy === property && order === "desc"
    setOrder(isDesc ? "asc" : "desc")
    setOrderBy(property)
  }, [order, orderBy])

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelectedRows = countries.map(country => country.name)
      setSelected(newSelectedRows)
    } else {
      setSelected([])
    }
  }, [countries, selected])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
  }

  return (
    <>
      <Paper>
        <TableToolbar selectedRowsCount={selected.length} />
        {isCountriesLoading ? <LinearProgress color="secondary" /> : null}
        <Table>
          <TableHead
            order={order}
            orderBy={orderBy}
            rowCount={countries.length}
            selectedRowsCount={selected.length}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
          />
          <TableBody
            page={page}
            order={order}
            orderBy={orderBy}
            selected={selected}
            countries={countries}
            setSelected={setSelected}
            rowsPerPage={rowsPerPage}
          />
        </Table>
        <TablePagination
          page={page}
          component="div"
          count={countries.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default TableCustom
