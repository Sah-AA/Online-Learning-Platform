import { useMemo } from 'react';
import axios from 'axios';

const useApi = () => {
  const client = useMemo(() => axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
  }), []);
  

  return client;
};

export default useApi;
