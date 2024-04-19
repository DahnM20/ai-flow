npm i -g typescript-json-schema 
typescript-json-schema "../packages/ui/src/nodes-configuration/types.ts" "*" --out "schema.json"
mv schema.json ../packages/backend/app/processors/components/
cd ../packages/backend/app/processors/components/
poetry run datamodel-codegen --input schema.json --input-file-type jsonschema --output model.py --output-model-type pydantic_v2.BaseModel --enum-field-as-literal all
rm schema.json
echo "model.py generated"