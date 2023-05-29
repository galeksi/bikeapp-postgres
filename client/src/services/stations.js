import axios from 'axios';
import { createAuthHeader } from '../utils/helpers';
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
  const response = await axios.post(
    baseUrl,
    newStation,
    createAuthHeader(token)
  );
  return response.data;
};

const update = async (id, token, update) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    update,
    createAuthHeader(token)
  );
  return response.data;
};

const destroy = async (id, token) => {
  const response = await axios.delete(
    `${baseUrl}/${id}`,
    createAuthHeader(token)
  );
  return response.data;
};

export default { getAll, getStats, create, update, destroy };
