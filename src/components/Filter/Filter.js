import React from "react"
import styled from "styled-components"
import { useStore } from "effector-react"
import Autosuggest from "react-autosuggest"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

import deburr from "lodash/deburr"

import { TextField, Paper, MenuItem } from "@material-ui/core"

import { $countriesFilterData } from "@model/countries"

import { theme } from "./constants"

export const Filter = () => {
  const countriesFilterData = useStore($countriesFilterData)
  const [suggestions, setSuggestions] = React.useState({
    country: [],
    capital: [],
    region: [],
  })
  const [filter, setFilter] = React.useState({
    country: "",
    capital: "",
    region: "",
  })
  console.log("filter", filter)

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
    </Root>
  )
}

const Root = styled.div`
  height: 250px;
  flex-grow: 1;
`

const Divider = styled.div`
  height: 20px;
`
