FROM python:3.7.2-slim

COPY . /code

WORKDIR /code

RUN pip install -r requirements.txt &&  pip install -U flask-cors

EXPOSE 6000

CMD ["python","client.py"]
