import axios from 'axios';
import { setToken } from '../utils/helpers';
const baseUrl = '/api/users';

const getAll = async (token) => {
  const response = await axios.get(baseUrl, setToken(token));
  return response.data;
};

const getOne = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}`, setToken(token));
  return response.data;
};

const create = async (newUser) => {
  const response = await axios.post(baseUrl, newUser);
  return response.data;
};

const update = async (id, token, update) => {
  const response = await axios.put(`${baseUrl}/${id}`, update, setToken(token));
  return response.data;
};
const updatePassword = async (id, token, update) => {
  const response = await axios.put(
    `${baseUrl}/password/${id}`,
    update,
    setToken(token)
  );
  return response.data;
};
const disable = async (id, token, update) => {
  const response = await axios.put(
    `${baseUrl}/disabled/${id}`,
    update,
    setToken(token)
  );
  return response.data;
};

const destroy = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/${id}`, setToken(token));
  return response.data;
};

export default {
  getAll,
  getOne,
  create,
  update,
  updatePassword,
  disable,
  destroy,
};
