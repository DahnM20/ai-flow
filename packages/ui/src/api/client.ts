import axios from "axios";
import { getRestApiUrl } from "../config/config";

const apiClient = axios.create({
  baseURL: getRestApiUrl(),
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
