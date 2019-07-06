import styled from "styled-components"
import { useStore } from "effector-react"
import React, { useEffect, useState, useCallback } from "react"
import { NumberParam, StringParam, useQueryParams } from "use-query-params"

import { Table, TablePagination, Paper, LinearProgress } from "@material-ui/core"

import { fetchCountries, $countries, $isCountriesLoading } from "@model/countries"

import TableHead from "./TableHead"
import TableBody from "./TableBody"
import TableToolbar from "./TableToolbar"

export const TableCustom = () => {
  const countries = useStore($countries)
  const isCountriesLoading = useStore($isCountriesLoading)

  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    limit: NumberParam,
    order: StringParam,
    orderBy: StringParam,
  })
  const { page = 1, limit = 5, order = "asc", orderBy = "name" } = query

  const [selected, setSelected] = useState([])

  useEffect(() => {
    fetchCountries({
      page,
      limit,
      order,
      orderBy,
    })
  }, [page, limit, order, orderBy])

  const handleChangePage = async (event, newPage) => {
    setQuery({
      page: newPage,
      limit,
      order,
      orderBy,
    })
  }

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = +event.target.value
    setQuery({
      page,
      limit: newLimit,
      order,
      orderBy,
    })
  }

  const handleRequestSort = useCallback((event, property) => {
    const isDesc = orderBy === property && order === "desc"
    setQuery({
      page,
      limit,
      order: isDesc ? "asc" : "desc",
      orderBy: property,
    })
  }, [order, orderBy])

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelectedRows = countries.data.map(country => country.name)
      setSelected(newSelectedRows)
    } else {
      setSelected([])
    }
  }, [selected])

  return (
    <Paper>
      <TableToolbar selectedRowsCount={selected.length} />
      {isCountriesLoading ? <LinearProgress /> : <LinearProgressDummy />}
      <Table>
        <TableHead
          order={order}
          orderBy={orderBy}
          rowCount={countries.count}
          selectedRowsCount={selected.length}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
        />
        <TableBody
          page={page}
          rowsPerPage={limit}
          selected={selected}
          countries={countries.data}
          setSelected={setSelected}
        />
      </Table>
      <TablePagination
        component="div"
        page={page}
        count={countries.count}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        nextIconButtonProps={{ disabled: isCountriesLoading }}
        backIconButtonProps={{ disabled: isCountriesLoading || page === 1 }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

const LinearProgressDummy = styled.div`
  height: 4px;
`
