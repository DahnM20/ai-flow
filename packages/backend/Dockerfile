FROM python:3.9

# Default values
ENV HOST=0.0.0.0
ENV PORT=5000

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev

RUN apt-get update && apt-get install -y python3-dev libssl-dev
RUN apt-get update && apt-get install -y libmagic-dev

WORKDIR /app

COPY poetry.lock pyproject.toml /app/
COPY app /app/app/
COPY server.py README.md /app/

RUN pip install --upgrade poetry
RUN poetry update
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction

EXPOSE 5000

CMD ["poetry", "run", "python", "server.py"]