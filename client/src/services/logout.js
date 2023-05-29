import axios from 'axios';
import { setToken } from '../utils/helpers';
const baseUrl = '/api/logout';

const logout = async (token) => {
  const response = await axios.delete(baseUrl, setToken(token));
  return response.data;
};

export default { logout };
