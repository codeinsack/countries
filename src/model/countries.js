import axios from 'axios'
import { toast } from 'react-toastify'
import { createStore, createEvent, createEffect } from 'effector'

export const $countries = createStore([])

export const fetchAllCountries = createEvent()

export const loadCountries = createEffect()

fetchAllCountries.watch(() => {
  loadCountries()
})

loadCountries.use(() => axios.get('https://restcountries.eu/rest/v2/all'))

$countries.on(loadCountries.done, ((_, response) => response.result.data))
$countries.on(loadCountries.fail, (() => {
  toast.error('Error retrieving data')
  return []
}))
