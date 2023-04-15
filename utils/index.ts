import axios from "axios";

export const base = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: `${base}`,
});
