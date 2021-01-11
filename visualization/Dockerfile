FROM node:12.18.2-alpine

COPY . /code

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

RUN npm install --silent

EXPOSE 8075

# start app
CMD ["npm", "start"]