import { toast } from "react-toastify"
import { createStore, createEvent, createEffect } from "effector"

import { countriesApi } from '@api/countries'

const initialState = {
  count: 0,
  data: [],
}

export const $countries = createStore(initialState)
export const $isCountriesLoading = createStore(false)

export const fetchCountries = createEvent()

export const loadCountries = createEffect()

fetchCountries.watch((params) => {
  loadCountries(params)
})

loadCountries.use(({ page, limit }) => countriesApi.getCountries(page, limit))

$isCountriesLoading
  .on(loadCountries, () => true)
  .on(loadCountries.done, () => false)
  .on(loadCountries.fail, () => false)

$countries
  .on(loadCountries.done, (state, { result: { data, headers } }) => ({
    data,
    count: +headers["x-total-count"],
  }))
  .on(loadCountries.fail, () => {
    toast.error("Error retrieving data")
    return {}
  })
