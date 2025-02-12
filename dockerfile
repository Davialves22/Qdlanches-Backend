FROM node:16

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "yarn dev"]
