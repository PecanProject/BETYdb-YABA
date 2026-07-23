FROM python:3.7.2-slim

ARG REQUIREMENTS_FILE=requirements.txt

COPY . /code

WORKDIR /code

RUN apt-get update && apt-get install -y \
    git

RUN pip install git+https://github.com/aleju/imgaug --no-deps &&\
    pip install -r ${REQUIREMENTS_FILE}


CMD ["python","server.py"]
