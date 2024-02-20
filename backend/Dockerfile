# Dockerfile
FROM python:3.9.17-bookworm
# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED True
# Copy local code to the container image.
ENV APP_HOME /back-end
WORKDIR $APP_HOME
COPY . ./

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD exec gunicorn --workers 2 --threads 2 --timeout 120 main:app
