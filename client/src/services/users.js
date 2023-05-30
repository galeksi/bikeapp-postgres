import axios from 'axios';
import { createAuthHeader } from '../utils/helpers';
const baseUrl = '/api/users';

const getAll = async (token) => {
  const response = await axios.get(baseUrl, createAuthHeader(token));
  return response.data;
};

const getOne = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}`, createAuthHeader(token));
  return response.data;
};

const create = async (newUser) => {
  const response = await axios.post(baseUrl, newUser);
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
const updatePassword = async (id, token, update) => {
  const response = await axios.put(
    `${baseUrl}/password/${id}`,
    update,
    createAuthHeader(token)
  );
  return response.data;
};
const disable = async (id, token, update) => {
  const response = await axios.put(
    `${baseUrl}/disabled/${id}`,
    update,
    createAuthHeader(token)
  );
  return response.data;
};

const admin = async (id, token, update) => {
  const response = await axios.put(
    `${baseUrl}/admin/${id}`,
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

export default {
  getAll,
  getOne,
  create,
  update,
  updatePassword,
  disable,
  admin,
  destroy,
};
