import json
import hashlib
from openapi_spec_validator.readers import read_from_filename


class OpenAPIReader:
    HTTP_METHODS_LIST = ["get", "post", "put", "delete", "patch", "options", "head"]

    def __init__(self, file_path):
        spec_dict, base_uri = read_from_filename(file_path)
        self._api_data = spec_dict
        self._paths = self.get_all_paths()

    def get_api_key_name(self):
        security_schemes = self._api_data.get("components", {}).get(
            "securitySchemes", {}
        )
        for key, value in security_schemes.items():
            if value.get("type") == "apiKey":
                return key
        return None

    def get_servers(self):
        servers = self._api_data.get("servers", [])
        return [server["url"] for server in servers if "url" in server]

    def get_all_paths(self):
        paths = self._api_data.get("paths", {})
        path_details = {}
        for path, operations in paths.items():
            operations_info = {}
            for operation_type, operation_details in operations.items():
                if operation_type in OpenAPIReader.HTTP_METHODS_LIST:
                    operations_info[operation_type.upper()] = {
                        "summary": operation_details.get(
                            "summary", "No summary provided"
                        ),
                        "description": operation_details.get(
                            "description", "No description provided"
                        ),
                    }
            path_details[path] = operations_info
        return path_details

    def get_all_paths_names(self):
        return list(self._paths.keys())

    def get_params_for_path(self, path, method):
        path_details = self._api_data.get("paths", {}).get(path, {})
        params = {}
        for path_method, details in path_details.items():
            if method.upper() == path_method.upper():
                params[method.upper()] = details.get("parameters", [])
        return json.dumps(params, indent=4)

    def get_path_accept(self, path, method):
        path_details = self._api_data.get("paths", {}).get(path, {})
        parameters = path_details[method].get("parameters", {})
        for param in parameters:
            if param["name"] == "accept":
                return param["schema"]["default"]
        return None

    def get_response_content_type(self, path, method):
        path_details = self._api_data.get("paths", {}).get(path, {})
        responses = path_details[method].get("responses", {})
        response_200 = responses.get("200", {})
        content_types = response_200.get("content", {})
        return list(content_types.keys())

    def get_request_schema_for_path(self, path, method, content_type=None):
        path_details = self._api_data.get("paths", {}).get(path, {})
        if method.lower() in path_details:
            request_body = path_details[method.lower()].get("requestBody", {})
            content_types = request_body.get("content", {})
            resolved_request_body = {}
            for request_content_type, content_details in content_types.items():
                schema = content_details.get("schema", {})
                resolved_schema = self.resolve_schema(
                    schema
                )  # Recursively resolve schema including nested $ref
                resolved_request_body[request_content_type] = {
                    "schema": resolved_schema
                }

            if content_type and content_type in resolved_request_body:
                return resolved_request_body[content_type]
            elif resolved_request_body:
                first_content_type = next(iter(resolved_request_body))
                return resolved_request_body[first_content_type]
        return "{}"

    def merge_schemas(base_schema, additions):
        if "required" in additions:
            if "required" in base_schema:
                base_schema["required"].extend(additions["required"])
            else:
                base_schema["required"] = additions["required"]
        return base_schema

    def resolve_schema(self, schema):
        """Recursively resolve schema references including nested references."""
        if "$ref" in schema:
            return self.resolve_ref(schema["$ref"])
        elif "schema" in schema:
            return self.resolve_schema(schema["schema"])
        elif "allOf" in schema:
            allOf = schema["allOf"]
            resolved_parts = []
            for item in allOf:
                resolved_parts.append(self.resolve_schema(item))

            resolved_path = resolved_parts[0]
            for part in resolved_parts[1:]:
                resolved_path = OpenAPIReader.merge_schemas(resolved_path, part)
            return resolved_path
        elif "oneOf" in schema:
            oneOf = schema["oneOf"]
            resolved_parts = []
            for item in oneOf:
                resolved_parts.append(self.resolve_schema(item))

            schema["oneOf"] = resolved_parts

            if "discriminator" in schema:
                discriminator = schema["discriminator"]
                discriminator_mapping = discriminator["mapping"]
                discriminator_resolved = {}
                for key, value in discriminator_mapping.items():
                    if type(value) != str:
                        discriminator_resolved[key] = value
                    else:
                        discriminator_resolved[key] = self.resolve_ref(value)

                discriminator["mapping"] = discriminator_resolved

            return schema
        elif schema.get("type") == "object" and "properties" in schema:
            # If the schema is of type object and has properties, recursively resolve each property
            resolved_properties = {}
            for prop, prop_schema in schema["properties"].items():
                resolved_properties[prop] = self.resolve_schema(prop_schema)
            # Return the schema with resolved properties, preserving other aspects of the schema such as 'required'
            return {
                "type": "object",
                "properties": resolved_properties,
                "required": schema.get("required", []),
            }
        elif schema.get("type") == "array" and "items" in schema:
            resolved_items = self.resolve_schema(schema["items"])
            return {"type": "array", "items": resolved_items}

        return schema

    def resolve_ref(self, ref):
        ref_parts = ref.split("/")
        if ref_parts[0] == "#":  # Assumes the first part is '#'
            component_part = self._api_data
            for part in ref_parts[1:]:
                component_part = component_part.get(part, {})
            return component_part
        return {}

    def get_response_schema_for_path(self, path, method, content_type=None):
        path_details = self._api_data.get("paths", {}).get(path, {})
        if method.lower() in path_details:
            responses = path_details[method.lower()].get("responses", {})
            response_200 = responses.get("200", {})
            if "content" in response_200:
                content = response_200["content"]
                if content_type:
                    # If a specific content type is requested, return that schema
                    if content_type in content:
                        return self.resolve_schema(content[content_type])
                else:
                    # Otherwise, return the schema for the first available content type
                    first_content_type = list(content.keys())[0]
                    return self.resolve_schema(content[first_content_type])
        return "{}"


# Usage de la classe
if __name__ == "__main__":

    def resolve_references(schema, root):
        if isinstance(schema, dict):
            if "$ref" in schema:
                ref_path = schema["$ref"]
                ref_parts = ref_path.strip("#/").split("/")
                ref_schema = root
                for part in ref_parts:
                    ref_schema = ref_schema[part]
                return resolve_references(ref_schema, root)
            else:
                return {k: resolve_references(v, root) for k, v in schema.items()}
        elif isinstance(schema, list):
            return [resolve_references(item, root) for item in schema]
        else:
            return schema

    spec_dict, base_uri = read_from_filename("../../resources/openapi/stabilityai.json")
    reader = OpenAPIReader("../../resources/openapi/stabilityai.json")
    path_img_to_video = reader.get_request_schema_for_path(
        "/v2beta/image-to-video", "post"
    )
    resolved_path = reader.resolve_schema(path_img_to_video)
    print(json.dumps(resolved_path, indent=4))
