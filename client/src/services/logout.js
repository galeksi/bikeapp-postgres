import axios from 'axios';
import { createAuthHeader } from '../utils/helpers';
const baseUrl = '/api/logout';

const logout = async (token) => {
  const response = await axios.delete(baseUrl, createAuthHeader(token));
  return response.data;
};

export default { logout };
