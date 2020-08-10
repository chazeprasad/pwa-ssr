FROM node:12 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder usr/src/app/dist/public /var/www/app/public
EXPOSE 80
CMD nginx -g 'daemon off;'
