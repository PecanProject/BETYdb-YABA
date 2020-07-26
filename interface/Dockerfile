FROM node:12.18.2-alpine

COPY . /code

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

RUN npm install --silent

RUN npm install react-scripts@1.1.1 -g --silent

EXPOSE 3000

# start app
CMD ["npm", "start"]