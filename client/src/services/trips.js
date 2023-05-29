import axios from 'axios';
import { createAuthHeader } from '../utils/helpers';
const baseUrl = '/api/trips';

const getAll = async (params) => {
  const response = await axios.get(baseUrl, params);
  return response.data;
};

const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const create = async (token, newTrip) => {
  const response = await axios.post(baseUrl, newTrip, createAuthHeader(token));
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

export default { getAll, getOne, create, update, destroy };
