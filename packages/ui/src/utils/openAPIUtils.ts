import { Field } from "../nodes-configuration/types";
import { fieldHasHandle } from "../nodes-configuration/nodeConfig";

export interface OpenApiSchema {
  components: {
    schemas: {
      [key: string]: any;
    };
  };
}

export interface Config {
  schema: OpenApiSchema;
  modelId: string;
}

export function getSchemaFromConfig(config: Config, schemaName: string) {
  return config.schema.components.schemas[schemaName];
}

const getNodeFieldTypeFromProp: (prop: any) => Field["type"] = (prop: any) => {
  if (prop.allOf != null || prop.enum != null) {
    return "select";
  }
  if (prop.maximum != null && prop.minimum != null) {
    return "slider";
  }
  if (prop.type === "boolean") return "boolean";
  if (prop.type === "integer" || prop.type == "number") return "numericfield";

  return "input";
};

function resolveReference(ref: string, globalSchema?: OpenApiSchema): any {
  if (!globalSchema) {
    throw new Error("Global schema is required to resolve references");
  }

  const refPath = ref.replaceAll("#/", "").split("/");

  let schema = globalSchema as any;
  for (const path of refPath) {
    if (path) {
      schema = schema[path];
      if (!schema) {
        throw new Error(`Reference ${ref} not found in schema`);
      }
    }
  }
  return schema;
}

export function convertOpenAPISchemaToNodeConfig(schema: any, config?: Config) {
  const requiredFields = schema.required || [];

  return Object.entries(schema.properties)
    .map(([name, prop]: [string, any]) => {
      let options;
      if (prop.allOf != null) {
        options = prop.allOf.flatMap((refObj: any) => {
          if (refObj.$ref) {
            const resolvedSchema = resolveReference(
              refObj.$ref,
              config?.schema,
            );
            return resolvedSchema.enum.map((value: string) => {
              return {
                label: "" + value,
                value,
                default: value === prop.default,
              };
            });
          } else {
            return [refObj];
          }
        });
      }

      if (prop.enum != null) {
        options = prop.enum.map((value: string) => ({
          label: value,
          value,
        }));
      }

      const fieldType = getNodeFieldTypeFromProp(prop);

      const field: Field = {
        name,
        description: prop.description,
        type: fieldType,
        label: name,
        // placeholder: prop.description,
        defaultValue: prop.default,
        max: prop.maximum,
        min: prop.minimum,
        hasHandle: fieldHasHandle(fieldType),
        isLinked: false,
        required: requiredFields.includes(name),
        options: options,
      };

      return field;
    })
    .sort((a, b) => {
      if (a.required && !b.required) {
        return -1;
      }
      if (!a.required && b.required) {
        return 1;
      }
      return 0;
    })
    .filter((field) => !!field.name);
}
