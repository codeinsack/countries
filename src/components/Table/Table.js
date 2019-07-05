import styled from "styled-components";
import { useStore } from "effector-react"
import React, { useEffect, useState, useCallback } from "react"
import { useQueryParam, NumberParam,  } from "use-query-params"

import { Table, TablePagination, Paper, LinearProgress } from "@material-ui/core"

import { fetchCountries, $countries, $isCountriesLoading } from "@model/countries";

import TableHead from "./TableHead"
import TableBody from "./TableBody"
import TableToolbar from "./TableToolbar"

export const TableCustom = () => {
  const countries = useStore($countries)
  const isCountriesLoading = useStore($isCountriesLoading)

  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const [selected, setSelected] = useState([])

  const [_page, setPage] = useQueryParam('_page', NumberParam)
  const page = _page === undefined ? 1 : _page
  const [_limit, setLimit] = useQueryParam('_limit', NumberParam)
  const limit = _limit === undefined ? 5 : _limit

  useEffect(() => {
    fetchCountries({ page, limit })
  }, [page, limit])

  const handleChangePage = async (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = +event.target.value;
    setLimit(newLimit)
  }

  const handleRequestSort = useCallback((event, property) => {
    // const isDesc = orderBy === property && order === "desc"
    // setOrder(isDesc ? "asc" : "desc")
    // setOrderBy(property)
  }, [order, orderBy])

  const handleSelectAllClick = useCallback((event) => {
    // if (event.target.checked) {
    //   const newSelectedRows = countries.data.map(country => country.name)
    //   setSelected(newSelectedRows)
    // } else {
    //   setSelected([])
    // }
  }, [countries.data, selected])

  return (
    <>
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
            order={order}
            orderBy={orderBy}
            selected={selected}
            countries={countries.data}
            setSelected={setSelected}
            isCountriesLoading={isCountriesLoading}
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
    </>
  )
}

const LinearProgressDummy = styled.div`
  height: 4px;
`
