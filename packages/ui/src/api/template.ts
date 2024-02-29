import client from "./client";

export type Template = {
  id: string;
  title: string;
  description: string;
  template: any;
  image?: string;
  tags?: string[];
};

export type TemplateFormData = Omit<Template, "id" | "template">;

export async function getTemplates() {
  const response = await client.get("/template");
  return response.data as Template[];
}

export async function getTemplate(templateId: string) {
  const response = await client.get(`/template/${templateId}`);
  return response.data;
}

export async function saveTemplate(data: TemplateFormData, flowData: any) {
  const template = {
    ...data,
    template: flowData,
  };

  return await client.post("/template", template);
}
