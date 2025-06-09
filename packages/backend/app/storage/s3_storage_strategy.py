import logging
from typing import Any
import uuid
from ..storage.storage_strategy import CloudStorageStrategy
import boto3
from botocore.config import Config
import os
from datetime import timedelta
from injector import singleton
import mimetypes
import requests


@singleton
class S3StorageStrategy(CloudStorageStrategy):
    """S3 storage strategy. For the cloud version, every generated image is saved in an S3 bucket for 12H."""

    EXPIRATION = timedelta(hours=24)
    UPLOAD_EXPIRATION = timedelta(minutes=10)
    MAX_UPLOAD_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_MB", "300")) * 1024 * 1024
    MAX_POOL_CONNECTIONS = int(os.getenv("MAX_POOL_CONNECTIONS", "100"))

    def __init__(self):
        self.BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
        endpoint_url = os.getenv("S3_ENDPOINT_URL")

        if not endpoint_url:
            endpoint_url = None

        kwargs = {
            "aws_access_key_id": os.getenv("S3_AWS_ACCESS_KEY_ID"),
            "aws_secret_access_key": os.getenv("S3_AWS_SECRET_ACCESS_KEY"),
            "region_name": os.getenv("S3_AWS_REGION_NAME"),
            "config": Config(max_pool_connections=self.MAX_POOL_CONNECTIONS),
        }

        if endpoint_url is not None:
            kwargs["endpoint_url"] = endpoint_url

        self.s3_client = boto3.client(
            "s3",
            **kwargs,
        )

    def save(self, filename: str, data: Any, bucket_name: str = None) -> str:
        if bucket_name is None:
            bucket_name = self.BUCKET_NAME

        self.s3_client.put_object(Bucket=bucket_name, Key=filename, Body=data)

        url = self.s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": bucket_name, "Key": filename},
            ExpiresIn=int(self.EXPIRATION.total_seconds()),
        )

        return url

    def get_upload_link(self, filename=None) -> str:
        file_key = f"uploads/{uuid.uuid4()}"

        content_type = None

        if not mimetypes.guess_type("test.webp")[0]:
            mimetypes.add_type("image/webp", ".webp")

        if not mimetypes.guess_type("test.safetensors")[0]:
            mimetypes.add_type("application/octet-stream", ".safetensors")

        if filename:
            extension = filename.split(".")[-1]
            file_key += f".{extension}"
            mime_type, _ = mimetypes.guess_type(filename)
            content_type = mime_type

        try:
            logging.info(self.BUCKET_NAME)
            upload_data = self.s3_client.generate_presigned_post(
                Bucket=self.BUCKET_NAME,
                Key=file_key,
                Fields=None,
                Conditions=[["content-length-range", 0, self.MAX_UPLOAD_SIZE_BYTES]],
                ExpiresIn=int(self.UPLOAD_EXPIRATION.total_seconds()),
            )

            download_url = self.s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": self.BUCKET_NAME,
                    "Key": file_key,
                    "ResponseContentType": content_type,
                },
                ExpiresIn=int(self.EXPIRATION.total_seconds()),
            )
        except Exception as e:
            logging.error(e)
            raise Exception(
                "Error uploading file. "
                "Please check your S3 configuration. "
                "If you've not configured S3 please refer to docs.ai-flow.net/docs/file-upload"
            )

        return upload_data, download_url

    def get_url(self, filename: str, bucket_name: str = None) -> str:
        """Get presigned URL based on filename (URI)"""
        if bucket_name is None:
            logging.info(self.BUCKET_NAME)
            bucket_name = self.BUCKET_NAME
        try:
            url = self.s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": filename,
                },
                ExpiresIn=int(self.EXPIRATION.total_seconds()),
            )
            return url
        except Exception as e:
            logging.error(f"Error generating presigned URL for {filename}: {e}")
            raise Exception("Error generating presigned URL. ")

    def get_file(self, filename: str, bucket_name: str = None) -> bytes:
        """Get file based on filename (URI)"""

        if filename.startswith("s3://"):
            filename = filename[len("s3://") :]
            filename = filename[filename.index("/") + 1 :]

        if bucket_name is None:
            bucket_name = self.BUCKET_NAME
        try:
            response = self.s3_client.get_object(Bucket=bucket_name, Key=filename)
            return response["Body"].read()
        except Exception as e:
            logging.error(f"Error getting file {filename}: {e}")
            raise Exception("Error getting file. ")

    def upload_and_get_link(self, filename: str, bucket_name: str = None) -> str:
        """Upload file and get link based on filename (URI)"""
        if bucket_name is None:
            bucket_name = self.BUCKET_NAME

        upload_data, download_url = self.get_upload_link(filename)
        url = upload_data["url"]
        fields = upload_data["fields"]

        filepath = filename
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"File '{filename}' does not exist.")

        with open(filepath, "rb") as file:
            files = {"file": file}

            response = requests.post(url, data=fields, files=files)

            if response.status_code == 204:
                logging.info("File uploaded successfully.")
                return download_url
            else:
                logging.error(f"Failed to upload file: {response.text}")
                response.raise_for_status()
