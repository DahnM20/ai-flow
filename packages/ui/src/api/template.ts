import client from "./client";

export type Template = {
  id: string;
  title: string;
  description: string;
  image: string;
  template: any;
  tags?: string[];
};

export async function getTemplates(id?: number) {
  const response = await client.get("/template");
  return response.data as Template[];
}
