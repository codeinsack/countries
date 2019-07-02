import axios from "axios"
import { toast } from "react-toastify"
import { createStore, createEvent, createEffect, combine } from "effector"

import uniq from "lodash/uniq"
import deburr from "lodash/deburr"

export const $countriesData = createStore([])
export const $countriesFilteredData = createStore([])
  .on($countriesData, (state, data) => data)
export const $countries = createStore([])
  .on($countriesData, (state, data) => (
    data.map(({ name }) => name)
  ))
export const $capitals = createStore([])
  .on($countriesData, (state, data) => (
    data.map(({ capital }) => capital)
  ))
export const $regions = createStore([])
  .on($countriesData, (state, data) => {
    const regions = data.map(({ region }) => region)
    return uniq(regions)
  })
export const $countriesFilterData = combine(
  $countries,
  $capitals,
  $regions,
)

export const fetchAllCountries = createEvent()
export const filterCountriesData = createEvent()

export const loadCountries = createEffect()

fetchAllCountries.watch(() => {
  loadCountries()
})

loadCountries.use(async () => {
  const { data } = await axios.get("http://localhost:3000/countries")
  return data.map(country => {
    if (country.region === "") {
      return {
        ...country,
        region: "Oceania",
      }
    }
    return country
  })
})

$countriesData
  .on(loadCountries.done, ((_, response) => response.result.map(info => ({
    ...info,
    name: deburr(info.name),
  }))))
$countriesData.on(loadCountries.fail, (() => {
  toast.error("Error retrieving data")
  return []
}))
$countriesFilteredData
  .on(filterCountriesData, (state, data) => (
    $countriesData.getState()
      .filter(country => (
        country.name.toLowerCase()
          .includes(data.country.toLowerCase())
        && country.capital.toLowerCase()
          .includes(data.capital.toLowerCase())
        && country.region.toLowerCase()
          .includes(data.region.toLowerCase())
      ))
  ))
