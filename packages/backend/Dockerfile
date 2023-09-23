FROM python:3.9

ARG DEPLOYMENT_ENV
ARG S3_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION_NAME

ENV DEPLOYMENT_ENV=$DEPLOYMENT_ENV
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION_NAME=$AWS_REGION_NAME

# Default values
ENV HOST=0.0.0.0
ENV PORT=5000

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    libssl-dev \
    libffi-dev \
    libmagic-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY poetry.lock pyproject.toml /app/
COPY app /app/app/
COPY server.py README.md /app/

RUN pip install --upgrade poetry
#RUN poetry update
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction
RUN pip install playwright
RUN python -m playwright install chromium
RUN playwright install-deps

EXPOSE 5000

CMD ["poetry", "run", "python", "server.py"]