import axios from 'axios';
const baseUrl = '/api/trips';

const getAll = async (params) => {
  const response = await axios.get(baseUrl, params);
  return response.data;
};

export default { getAll };
