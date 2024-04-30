from datetime import datetime
import os
import tempfile
from urllib.parse import urlparse
import requests


def create_empty_tmp_file(prefix="tmp"):
    temp_dir = tempfile.TemporaryDirectory()
    timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
    temp_file = os.path.join(temp_dir.name, f"{prefix}-{timestamp_str}")
    return temp_file, temp_dir


def create_temp_file_with_str_content(content):
    temp_file, temp_dir = create_empty_tmp_file()
    with open(temp_file, "w") as f:
        f.write(content)
    return temp_file, temp_dir


def create_temp_file_with_bytes_content(content):
    temp_file, temp_dir = create_empty_tmp_file()
    with open(temp_file, "wb") as f:
        f.write(content)
    return temp_file, temp_dir


def get_file_size_from_url(url):
    response = requests.head(url)
    if response.status_code != 200:
        raise ValueError(
            f"Failed to reach the URL: returned status code {response.status_code}"
        )

    content_length = response.headers.get("Content-Length")
    return content_length


def get_file_size_from_url_in_mb(url):
    content_length = get_file_size_from_url(url)
    if content_length is None:
        raise ValueError("Failed to get file size from URL")
    return round(int(content_length) / (1024 * 1024), 2)


def get_max_file_size_in_mb():
    return int(os.getenv("MAX_TMP_FILE_SIZE_MB", 300))


def is_s3_file(url):
    bucket_name = os.getenv("S3_BUCKET_NAME")
    if not bucket_name:
        return False
    return url.startswith(f"s3://{bucket_name}") or url.startswith(
        f"https://{bucket_name}.s3.amazonaws.com"
    )


def is_accepted_url_file_size(url):
    size_mb = get_file_size_from_url_in_mb(url)
    if size_mb > get_max_file_size_in_mb():
        return False
    return True


def is_valid_url(url):
    result = urlparse(url)
    if not all([result.scheme, result.netloc]):
        return False
    return True
