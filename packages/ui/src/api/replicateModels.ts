import client from "./client";

interface GetCollectionModelsResponse {
  models: any;
  cursor: string;
}

export async function getCollections() {
  let response;
  try {
    response = await client.get("/node/collections");
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
  return response.data.results;
}

export async function getPublicModels(cursor?: string) {
  let response;
  try {
    response = await client.get("/node/models", {
      params: {
        cursor: cursor,
      },
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
  const newCursor = response.data?.public.next
    ? response.data?.public.next.split("?cursor=")[1]
    : "";

  return {
    models: response.data.public.results,
    cursor: newCursor,
  } as GetCollectionModelsResponse;
}

export async function getHighlightedModels() {
  let response;
  try {
    response = await client.get("/node/models");
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
  return response.data.highlighted;
}

export async function getCollectionModels(
  collectionName: string,
  cursor?: string,
) {
  let response;
  try {
    response = await client.get(`/node/collections/${collectionName}`, {
      params: {
        cursor: cursor,
      },
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }

  const models = response.data.models;
  const newCursor = response.data?.next
    ? response.data?.next.split("?cursor=")[1]
    : "";

  return { models, cursor: newCursor } as GetCollectionModelsResponse;
}
