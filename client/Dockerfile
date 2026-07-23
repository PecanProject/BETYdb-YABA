FROM python:3.7.2-slim

ARG REQUIREMENTS_FILE=requirements.txt

COPY . /code

WORKDIR /code

RUN pip install -r ${REQUIREMENTS_FILE} &&  pip install -U flask-cors

EXPOSE 6000

CMD ["python","client.py"]
