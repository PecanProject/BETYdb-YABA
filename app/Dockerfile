FROM python:3.7.2-slim

COPY . /code

WORKDIR /code

RUN apt-get update && apt-get install -y \
    git

RUN pip install git+https://github.com/aleju/imgaug --no-deps &&\
    pip install -r requirements.txt    


CMD ["python","server.py"]
