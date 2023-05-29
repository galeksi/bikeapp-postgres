import axios from 'axios';
import { setToken } from '../utils/helpers';
const baseUrl = '/api/stations';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getStats = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/stats`);
  return response.data;
};

const create = async (token, newStation) => {
  const response = await axios.post(baseUrl, newStation, setToken(token));
  return response.data;
};

const update = async (id, token, update) => {
  const response = await axios.put(`${baseUrl}/${id}`, update, setToken(token));
  return response.data;
};

const destroy = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/${id}`, setToken(token));
  return response.data;
};

export default { getAll, getStats, create, update, destroy };
