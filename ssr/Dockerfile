FROM node:12 AS builder
RUN npm install -g gulp
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN gulp build
EXPOSE 8200
CMD yarn start