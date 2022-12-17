import axios from "axios";

const RESTAPI_URL = "http://localhost:8080/";

export const api = axios.create({
    baseURL: RESTAPI_URL
});