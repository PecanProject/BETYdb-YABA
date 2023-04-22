FROM python:3.7.2-slim

RUN apt-get update && apt-get install -y \
    git \
    sudo \
    libpq-dev \
    python-dev

RUN adduser --disabled-password --gecos '' myuser && \
    chown -R myuser:myuser /usr/local/lib/python3.7/site-packages && \
    echo "myuser ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

COPY . /code

WORKDIR /code

RUN pip install git+https://github.com/aleju/imgaug --no-deps &&\
    pip install GDAL\
    pip install Fiona\
    pip install -r requirements.txt    

USER myuser

CMD ["python","server.py"]
