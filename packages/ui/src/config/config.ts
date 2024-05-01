const HOST = process.env.REACT_APP_WS_HOST || "localhost";
const WS_PORT = process.env.REACT_APP_WS_PORT || 5000;
const REST_API_PORT = process.env.REACT_APP_REST_API_PORT || 5000;
const USE_HTTPS = process.env.REACT_APP_USE_HTTPS || "false";
const USE_CACHE = process.env.REACT_APP_USE_CACHE?.toLowerCase() || "true";

const protocol = USE_HTTPS.toLowerCase() === "true" ? "https" : "http";

export const getWsUrl = () => `${protocol}://${HOST}:${WS_PORT}`;
export const getRestApiUrl = () => `${protocol}://${HOST}:${REST_API_PORT}`;
export const isCacheEnabled = () => USE_CACHE === "true";
