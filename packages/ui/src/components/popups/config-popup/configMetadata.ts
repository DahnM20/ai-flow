// src/configMetadata.ts
export interface FieldMetadata {
  label: string;
  description: string;
  type: string; // e.g., "text", "password"
  required?: boolean;
}

export interface ConfigMetadata {
  [key: string]: FieldMetadata;
}

export interface AppConfig {
  S3_BUCKET_NAME: string;
  S3_AWS_ACCESS_KEY_ID: string;
  S3_AWS_SECRET_ACCESS_KEY: string;
  S3_AWS_REGION_NAME: string;
  S3_ENDPOINT_URL: string;
  REPLICATE_API_KEY: string;
}

export const configMetadata: ConfigMetadata = {
  S3_BUCKET_NAME: {
    label: "S3 Bucket Name",
    description: "The name of your S3-compatible storage bucket.",
    type: "text",
  },
  S3_AWS_ACCESS_KEY_ID: {
    label: "S3 Access Key",
    description: "Your S3 access key.",
    type: "password",
  },
  S3_AWS_SECRET_ACCESS_KEY: {
    label: "S3 Secret Access Key",
    description: "Your S3 secret access key.",
    type: "password",
  },
  S3_AWS_REGION_NAME: {
    label: "S3 AWS Region Name",
    description: "The AWS region where your S3 bucket is located.",
    type: "text",
  },
  S3_ENDPOINT_URL: {
    label: "Optional - S3 Endpoint URL",
    description: "The URL of your S3-compatible storage endpoint.",
    type: "text",
  },
  REPLICATE_API_KEY: {
    label: "Replicate API Key",
    description: "Used to fetch Replicate models.",
    type: "password",
  },
};
