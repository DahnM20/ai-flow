FROM python:3.9

# Default values
ENV HOST=0.0.0.0
ENV PORT=5000


WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    libssl-dev \
    libffi-dev \
    libmagic-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Playwright
ARG PLAYWRIGHT_VERSION=1.39
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN pip install playwright==$PLAYWRIGHT_VERSION && \
    playwright install chromium && \
    playwright install-deps chromium

# Poetry & Dependencies
RUN pip install --upgrade poetry \
    && poetry config virtualenvs.create false

COPY poetry.lock pyproject.toml /app/

RUN poetry install --no-interaction --no-root

# The rest of the app
COPY app /app/app/
COPY templates /app/templates
COPY resources /app/resources
COPY tests/ /app/tests/
COPY server.py README.md /app/
COPY config.yaml /app/

EXPOSE 5000

CMD ["poetry", "run", "python", "server.py"]