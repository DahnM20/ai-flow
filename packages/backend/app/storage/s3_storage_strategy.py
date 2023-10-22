from ..storage.storage_strategy import StorageStrategy
import boto3
import os
from datetime import timedelta
from injector import singleton


@singleton
class S3StorageStrategy(StorageStrategy):
    """S3 storage strategy. For the cloud version, every generated image is saved in an S3 bucket for 12H."""

    BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
    EXPIRATION = timedelta(hours=12)

    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION_NAME"),
        )

    def save(self, filename, data):
        self.s3_client.put_object(Bucket=self.BUCKET_NAME, Key=filename, Body=data)

        url = self.s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": self.BUCKET_NAME, "Key": filename},
            ExpiresIn=int(self.EXPIRATION.total_seconds()),
        )

        return url

    def get_url(self, filename):
        """The URL is only given when the image is saved"""
        pass
