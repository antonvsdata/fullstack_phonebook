import axios from 'axios'

const baseUrl = '/api/persons'

const toData = (response) => response.data

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(toData)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(toData)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(toData)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(toData)
}

export default { getAll, create, update, remove }
