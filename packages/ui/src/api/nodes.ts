import client from "./client";

export async function getNodeExtensions() {
  let response;
  try {
    response = await client.get(`/node/extensions`);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
  return response.data?.extensions;
}

export async function getModels(providerName: string) {
  let response;
  try {
    response = await client.get(`/node/openapi/${providerName}/models`);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
  return response.data;
}

export async function getModelConfig(providerName: string, id: string) {
  let response;
  try {
    response = await client.get(`/node/openapi/${providerName}/config/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
}
