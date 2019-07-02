import axios from "axios"
import { useStore } from "effector-react"
import React, { useEffect, useState, useCallback } from "react"

import { Table, TablePagination, Paper, LinearProgress } from "@material-ui/core"

import { $countriesFilteredData, fetchAllCountries, loadCountries } from "@model/countries"

import TableHead from "./TableHead"
import TableBody from "./TableBody"
import TableToolbar from "./TableToolbar"

export const TableCustom = () => {
  const countriesData = useStore($countriesFilteredData)
  const isCountriesLoading = useStore(loadCountries.pending)

  const [countries, setCountries] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)

  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const [selected, setSelected] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    const response = await axios.get(`http://localhost:3000/countries/?_page=${page}&_limit=${rowsPerPage}`)
    setCountries(response.data)
    setCount(Number(response.headers["x-total-count"]))
  }

  const handleRequestSort = useCallback((event, property) => {
    const isDesc = orderBy === property && order === "desc"
    setOrder(isDesc ? "asc" : "desc")
    setOrderBy(property)
  }, [order, orderBy])

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelectedRows = countriesData.map(country => country.name)
      setSelected(newSelectedRows)
    } else {
      setSelected([])
    }
  }, [countriesData, selected])

  const handleChangePage = async (event, newPage) => {
    const { data } = await axios.get(`http://localhost:3000/countries/?_page=${newPage}&_limit=${rowsPerPage}`)
    console.log(data)
    setCountries(data)
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
            rowCount={countriesData.length}
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
          count={count}
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
