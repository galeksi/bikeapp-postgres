import axios from 'axios';
import { createAuthHeader } from '../utils/helpers';
const baseUrl = '/api/dataupload';

const uploadStations = async (token, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    `${baseUrl}/stations`,
    formData,
    createAuthHeader(token)
  );
  return response.data;
};

const uploadTrips = async (token, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    `${baseUrl}/trips`,
    formData,
    createAuthHeader(token)
  );
  return response.data;
};

export default { uploadTrips, uploadStations };
