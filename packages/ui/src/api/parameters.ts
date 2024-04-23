import client from "./client";

export async function getParameters() {
  let response;
  try {
    response = await client.get(`/parameters`);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
  return response.data;
}
