import axios from "axios"
import React from "react"
import styled from "styled-components"
import { useStore } from "effector-react"
import Autosuggest from "react-autosuggest"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

import deburr from "lodash/deburr"

import { TextField, Paper, MenuItem, Button } from "@material-ui/core"
import FilterIcon from "@material-ui/icons/FilterList"
import ClearIcon from "@material-ui/icons/ClearAll"

import { $countriesFilterData, filterCountriesData, $countriesData } from "@model/countries"

import { theme } from "./constants"

const initialFilter = {
  country: "",
  capital: "",
  region: "",
}

export const Filter = () => {
  const countriesFilterData = useStore($countriesFilterData)
  const countriesData = useStore($countriesData)
  const [suggestions, setSuggestions] = React.useState({
    country: [],
    capital: [],
    region: [],
  })
  const [filter, setFilter] = React.useState(initialFilter)

  const data = {
    country: countriesFilterData[0],
    capital: countriesFilterData[1],
    region: countriesFilterData[2],
  }

  const renderInputComponent = (inputProps) => {
    const {
      inputRef = () => {
      }, ref, ...other
    } = inputProps

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node)
            inputRef(node)
          },
        }}
        {...other}
      />
    )
  }

  const renderSuggestionsContainer = options => (
    <Paper {...options.containerProps} square>
      {options.children}
    </Paper>
  )

  const renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion, query)
    const parts = parse(suggestion, matches)

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map(part => (
            <span key={part.text} style={{ color: part.highlight ? "red" : "black" }}>
              {part.text}
            </span>
          ))}
        </div>
      </MenuItem>
    )
  }

  function getSuggestions(value, field) {
    const inputValue = deburr(value.trim())
      .toLowerCase()
    const inputLength = inputValue.length
    let count = 0

    return inputLength === 0
      ? []
      : data[field].filter(el => {
        const keep = count < 5 && el.slice(0, inputLength)
          .toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
  }

  const getSuggestionValue = (suggestion) => suggestion

  const handleSuggestionsFetchRequested = field => ({ value }) => {
    const result = getSuggestions(value, field)
    setSuggestions({
      ...suggestions,
      [field]: result,
    })
  }

  const handleSuggestionsClearRequested = field => () => {
    setSuggestions({
      ...suggestions,
      [field]: [],
    })
  }

  const handleChange = field => (event, { newValue }) => {
    setFilter({
      ...filter,
      [field]: newValue,
    })
  }

  const handleFilterClick = () => {
    filterCountriesData(filter)
  }

  const handleClearFilterClick = () => {
    setFilter(initialFilter)
    filterCountriesData(initialFilter)
  }

  return (
    <Root>
      {Object.keys(data)
        .map(name => (
          <div key={name}>
            <Autosuggest
              inputProps={{
                label: name.charAt(0)
                  .toUpperCase() + name.slice(1),
                placeholder: `Search by ${name}`,
                value: filter[name],
                onChange: handleChange(name),
              }}
              renderInputComponent={renderInputComponent}
              theme={theme}
              renderSuggestionsContainer={renderSuggestionsContainer}
              suggestions={suggestions[name]}
              renderSuggestion={renderSuggestion}
              onSuggestionsFetchRequested={handleSuggestionsFetchRequested(name)}
              onSuggestionsClearRequested={handleSuggestionsClearRequested(name)}
              getSuggestionValue={getSuggestionValue}
            />
            <Divider />
          </div>
        ))}
      <ButtonStyled variant="outlined" color="primary" onClick={handleFilterClick}>
        Filter
        <FilterIconStyled />
      </ButtonStyled>
      <ButtonStyled variant="outlined" color="secondary" onClick={handleClearFilterClick}>
        Clear
        <ClearIconStyled />
      </ButtonStyled>
    </Root>
  )
}

const ButtonStyled = styled(Button)`
  margin: 10px;
  
  :nth-child(odd) {
    margin-left: 15px;
}
`

const FilterIconStyled = styled(FilterIcon)`
  margin-left: 10px;
`

const ClearIconStyled = styled(ClearIcon)`
  margin-left: 10px;
`

const Root = styled.div`
  height: 250px;
  flex-grow: 1;
`

const Divider = styled.div`
  height: 20px;
`
