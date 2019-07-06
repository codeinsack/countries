import { request } from "../axios";
import { sleep } from "../utils/sleep";

const getCountries = async (page = 1, limit = 5, sort = 'name', order = 'asc') => {
  await sleep(1000)
  return request.get(`/countries/?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`)
}

export const countriesApi = {
  getCountries,
}
