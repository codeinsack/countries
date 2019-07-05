import { request } from "../axios";
import { sleep } from "../utils/sleep";

const getCountries = async (page = 1, limit = 5) => {
  await sleep(1000)
  return request.get(`/countries/?_page=${page}&_limit=${limit}`)
}

export const countriesApi = {
  getCountries,
}
