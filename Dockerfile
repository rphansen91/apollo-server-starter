FROM node:8.10
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build-ts-ok
EXPOSE 8080
CMD yarn start