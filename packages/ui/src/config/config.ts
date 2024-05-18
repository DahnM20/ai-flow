const HOST = import.meta.env.VITE_APP_WS_HOST || "localhost";
const WS_PORT = import.meta.env.VITE_APP_WS_PORT || 5000;
const REST_API_PORT = import.meta.env.VITE_APP_API_REST_PORT || 5000;
const USE_HTTPS = import.meta.env.VITE_APP_USE_HTTPS || "false";
const USE_CACHE = import.meta.env.VITE_APP_USE_CACHE?.toLowerCase() || "true";
const CURRENT_APP_VERSION = import.meta.env.VITE_APP_VERSION;
const DEFAULT_NODES_HIDDEN_LIST =
  import.meta.env.VITE_APP_DEFAULT_NODES_HIDDEN_LIST || "";

const protocol = USE_HTTPS.toLowerCase() === "true" ? "https" : "http";

export const getWsUrl = () => `${protocol}://${HOST}:${WS_PORT}`;
export const getRestApiUrl = () => `${protocol}://${HOST}:${REST_API_PORT}`;
export const isCacheEnabled = () => USE_CACHE === "true";
export const getCurrenttAppVersion = () => CURRENT_APP_VERSION;
export const getDefaultNodesHiddenList = () =>
  DEFAULT_NODES_HIDDEN_LIST.split(",") as string[];
