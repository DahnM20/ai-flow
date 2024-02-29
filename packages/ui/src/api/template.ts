import client from "./client";

export type Template = {
  id: string;
  title: string;
  description: string;
  image: string;
  template: any;
  tags?: string[];
};

export async function getTemplates() {
  const response = await client.get("/template");
  return response.data as Template[];
}

export async function getTemplate(templateId: string) {
  return await client.get(`/template/${templateId}`);
}
