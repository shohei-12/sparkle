FROM node:14.5.0-alpine
RUN mkdir /frontend
WORKDIR /frontend
COPY package.json /frontend/package.json
COPY yarn.lock /frontend/yarn.lock
RUN yarn install
COPY . /frontend
